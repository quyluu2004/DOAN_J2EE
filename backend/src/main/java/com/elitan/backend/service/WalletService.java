package com.elitan.backend.service;

import com.elitan.backend.dto.WalletResponse;
import com.elitan.backend.entity.User;
import com.elitan.backend.entity.Wallet;
import com.elitan.backend.entity.WalletTransaction;
import com.elitan.backend.repository.UserRepository;
import com.elitan.backend.repository.WalletRepository;
import com.elitan.backend.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final UserRepository userRepository;

    private static final BigDecimal VIP_PRICE = new BigDecimal("10.00"); // $10
    private static final int VIP_DURATION_DAYS = 30;

    // Lấy hoặc tạo ví cho user
    @Transactional
    public Wallet getOrCreateWallet(User user) {
        return walletRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Wallet wallet = Wallet.builder()
                            .user(user)
                            .balance(BigDecimal.ZERO)
                            .build();
                    return walletRepository.save(wallet);
                });
    }

    // Lấy thông tin ví (balance + VIP status)
    @Transactional
    public WalletResponse getWalletInfo(String email) {
        User user = findUser(email);
        Wallet wallet = getOrCreateWallet(user);

        // Auto-expire VIP
        checkVipExpiration(user);

        List<WalletResponse.WalletTransactionResponse> txns = transactionRepository
                .findByWalletIdOrderByCreatedAtDesc(wallet.getId())
                .stream()
                .map(this::mapTransaction)
                .collect(Collectors.toList());

        return WalletResponse.builder()
                .id(wallet.getId())
                .balance(wallet.getBalance())
                .vip(user.getVip())
                .vipExpiresAt(user.getVipExpiresAt())
                .transactions(txns)
                .build();
    }

    // Lấy số dư
    @Transactional(readOnly = true)
    public BigDecimal getBalance(String email) {
        User user = findUser(email);
        Wallet wallet = getOrCreateWallet(user);
        return wallet.getBalance();
    }

    // Nạp tiền vào ví (gọi sau khi MoMo callback thành công)
    @Transactional
    public void topUp(String email, BigDecimal amount, String description) {
        User user = findUser(email);
        Wallet wallet = getOrCreateWallet(user);

        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        WalletTransaction txn = WalletTransaction.builder()
                .wallet(wallet)
                .type("TOPUP")
                .amount(amount)
                .description(description != null ? description : "Nạp tiền qua MoMo")
                .build();
        transactionRepository.save(txn);

        log.info("✅ Nạp ví thành công: user={}, amount={}, newBalance={}", email, amount, wallet.getBalance());
    }

    // Nạp tiền bằng userId (dùng cho IPN callback khi chỉ có userId)
    @Transactional
    public void topUpByUserId(Long userId, BigDecimal amount, String description) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với ID: " + userId));
        topUp(user.getEmail(), amount, description);
    }

    // Trừ tiền ví khi thanh toán
    @Transactional
    public void pay(String email, BigDecimal amount, String description) {
        User user = findUser(email);
        Wallet wallet = getOrCreateWallet(user);

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Số dư ví không đủ! Cần " + amount + " nhưng chỉ có " + wallet.getBalance());
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);

        WalletTransaction txn = WalletTransaction.builder()
                .wallet(wallet)
                .type("PAYMENT")
                .amount(amount.negate()) // Lưu số âm để biết là trừ tiền
                .description(description != null ? description : "Thanh toán đơn hàng")
                .build();
        transactionRepository.save(txn);

        log.info("💳 Thanh toán ví: user={}, amount={}, newBalance={}", email, amount, wallet.getBalance());
    }

    // Hoàn tiền vào ví
    @Transactional
    public void refund(String email, BigDecimal amount, String description) {
        User user = findUser(email);
        Wallet wallet = getOrCreateWallet(user);

        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        WalletTransaction txn = WalletTransaction.builder()
                .wallet(wallet)
                .type("REFUND")
                .amount(amount)
                .description(description != null ? description : "Hoàn tiền đơn hàng")
                .build();
        transactionRepository.save(txn);

        log.info("🔄 Hoàn tiền ví: user={}, amount={}, newBalance={}", email, amount, wallet.getBalance());
    }

    // Mua VIP bằng ví
    @Transactional
    public WalletResponse purchaseVip(String email) {
        User user = findUser(email);
        Wallet wallet = getOrCreateWallet(user);

        // Kiểm tra đã VIP chưa
        checkVipExpiration(user);
        if (Boolean.TRUE.equals(user.getVip())) {
            throw new RuntimeException("Bạn đang là thành viên VIP! Hết hạn: " + user.getVipExpiresAt());
        }

        // Kiểm tra số dư
        if (wallet.getBalance().compareTo(VIP_PRICE) < 0) {
            throw new RuntimeException("Số dư ví không đủ! Cần $" + VIP_PRICE + " nhưng chỉ có $" + wallet.getBalance());
        }

        // Trừ tiền
        wallet.setBalance(wallet.getBalance().subtract(VIP_PRICE));
        walletRepository.save(wallet);

        // Cập nhật VIP status
        user.setVip(true);
        user.setVipExpiresAt(LocalDateTime.now().plusDays(VIP_DURATION_DAYS));
        userRepository.save(user);

        // Lưu giao dịch
        WalletTransaction txn = WalletTransaction.builder()
                .wallet(wallet)
                .type("VIP_PURCHASE")
                .amount(VIP_PRICE.negate())
                .description("Mua gói VIP 30 ngày - $" + VIP_PRICE)
                .build();
        transactionRepository.save(txn);

        log.info("⭐ Mua VIP thành công: user={}, expiresAt={}", email, user.getVipExpiresAt());

        return getWalletInfo(email);
    }

    // Kiểm tra VIP hết hạn
    private void checkVipExpiration(User user) {
        if (Boolean.TRUE.equals(user.getVip()) && user.getVipExpiresAt() != null
                && user.getVipExpiresAt().isBefore(LocalDateTime.now())) {
            user.setVip(false);
            user.setVipExpiresAt(null);
            userRepository.save(user);
            log.info("⏰ VIP hết hạn cho user: {}", user.getEmail());
        }
    }

    // Kiểm tra user có phải VIP không (tự động check expiration)
    @Transactional
    public boolean isVip(String email) {
        User user = findUser(email);
        checkVipExpiration(user);
        return Boolean.TRUE.equals(user.getVip());
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }

    private WalletResponse.WalletTransactionResponse mapTransaction(WalletTransaction txn) {
        return WalletResponse.WalletTransactionResponse.builder()
                .id(txn.getId())
                .type(txn.getType())
                .amount(txn.getAmount())
                .description(txn.getDescription())
                .createdAt(txn.getCreatedAt())
                .build();
    }
}
