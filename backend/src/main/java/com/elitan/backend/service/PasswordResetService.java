package com.elitan.backend.service;

import com.elitan.backend.entity.PasswordResetToken;
import com.elitan.backend.entity.User;
import com.elitan.backend.repository.PasswordResetTokenRepository;
import com.elitan.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    // Tạo token reset password và gửi email
    @Transactional
    public void createPasswordResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với email: " + email));

        // Kiểm tra user đăng nhập bằng social (không có password)
        if (!"LOCAL".equals(user.getProvider())) {
            throw new RuntimeException(
                    "Tài khoản này đăng nhập bằng " + user.getProvider() + ". Không thể đặt lại mật khẩu.");
        }

        // Xóa token cũ nếu có
        tokenRepository.deleteByUser(user);

        // Tạo token mới (UUID, hết hạn sau 30 phút)
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(30))
                .build();

        tokenRepository.save(resetToken);

        // Gửi email với link reset
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
    }

    // Xác minh token và đặt lại mật khẩu
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ hoặc đã hết hạn"));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Token đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu lần nữa.");
        }

        // Cập nhật mật khẩu mới
        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Xóa token sau khi sử dụng
        tokenRepository.delete(resetToken);
    }
}
