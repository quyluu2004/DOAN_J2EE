package com.elitan.backend.repository;

import com.elitan.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // Tìm user theo nhà cung cấp social login
    Optional<User> findByProviderAndProviderId(String provider, String providerId);

    long countByCreatedAtAfter(java.time.LocalDateTime start);
}
