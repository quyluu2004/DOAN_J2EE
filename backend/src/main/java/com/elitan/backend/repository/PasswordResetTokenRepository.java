package com.elitan.backend.repository;

import com.elitan.backend.entity.PasswordResetToken;
import com.elitan.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);

    // Xóa tất cả token cũ của user khi tạo token mới
    void deleteByUser(User user);
}
