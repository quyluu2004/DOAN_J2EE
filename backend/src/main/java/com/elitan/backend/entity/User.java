package com.elitan.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    // Nullable vì user đăng nhập bằng Google/Facebook không có password
    @Column(nullable = true)
    private String passwordHash;

    @Column(nullable = false)
    private String fullName;

    @Builder.Default
    @Column(nullable = false)
    private String role = "USER"; // USER hoặc ADMIN

    // Nhà cung cấp đăng nhập: LOCAL, GOOGLE, FACEBOOK
    @Builder.Default
    @Column(nullable = false)
    private String provider = "LOCAL";

    // ID từ nhà cung cấp (Google sub / Facebook id)
    private String providerId;

    // Thông tin profile mở rộng
    private String phone;
    private String address;
    private String avatarUrl;

    @Builder.Default
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();
}
