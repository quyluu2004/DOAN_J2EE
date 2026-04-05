package com.elitan.backend.controller;

import com.elitan.backend.dto.MomoPaymentResponse;
import com.elitan.backend.dto.WalletResponse;
import com.elitan.backend.dto.WalletTopUpRequest;
import com.elitan.backend.service.MomoService;
import com.elitan.backend.service.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
@Slf4j
public class WalletController {

    private final WalletService walletService;
    private final MomoService momoService;

    /**
     * GET /api/wallet — Lấy thông tin ví (balance, VIP, history)
     */
    @GetMapping
    public ResponseEntity<WalletResponse> getWallet(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(walletService.getWalletInfo(authentication.getName()));
    }

    /**
     * POST /api/wallet/topup — Tạo link MoMo để nạp tiền ví
     * Body: { "amount": 50000 } (VND)
     */
    @PostMapping("/topup")
    public ResponseEntity<MomoPaymentResponse> topUp(
            Authentication authentication,
            @RequestBody WalletTopUpRequest request) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(
                    MomoPaymentResponse.builder()
                            .success(false)
                            .message("Vui lòng đăng nhập")
                            .build());
        }

        if (request.getAmount() < 1000 || request.getAmount() > 50000000) {
            return ResponseEntity.badRequest().body(
                    MomoPaymentResponse.builder()
                            .success(false)
                            .message("Số tiền nạp phải từ 1,000 đến 50,000,000 VND")
                            .build());
        }

        log.info("Tạo yêu cầu nạp ví qua MoMo: user={}, amount={}", authentication.getName(), request.getAmount());

        // Tạo MoMo payment với extraData chứa thông tin wallet topup
        MomoPaymentResponse response = momoService.createWalletTopUpPayment(
                authentication.getName(), request.getAmount());
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/wallet/purchase-vip — Mua gói VIP bằng ví ($10)
     */
    @PostMapping("/purchase-vip")
    public ResponseEntity<?> purchaseVip(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Vui lòng đăng nhập"));
        }

        try {
            WalletResponse wallet = walletService.purchaseVip(authentication.getName());
            return ResponseEntity.ok(wallet);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
