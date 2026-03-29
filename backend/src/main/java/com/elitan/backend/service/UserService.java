package com.elitan.backend.service;

import com.elitan.backend.dto.ChangePasswordRequest;
import com.elitan.backend.dto.UpdateProfileRequest;
import com.elitan.backend.dto.UserProfileResponse;
import com.elitan.backend.entity.User;
import com.elitan.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }

    // Lấy thông tin profile từ email (JWT)
    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .avatarUrl(user.getAvatarUrl())
                .provider(user.getProvider())
                .role(user.getRole())
                .build();
    }

    // Cập nhật thông tin profile
    public UserProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        userRepository.save(user);

        return UserProfileResponse.builder()
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .avatarUrl(user.getAvatarUrl())
                .provider(user.getProvider())
                .role(user.getRole())
                .build();
    }

    // Đổi mật khẩu (cần xác minh mật khẩu cũ)
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra user social login
        if (!"LOCAL".equals(user.getProvider())) {
            throw new RuntimeException("Tài khoản đăng nhập bằng " + user.getProvider() + " không thể đổi mật khẩu");
        }

        // Xác minh mật khẩu cũ
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Mật khẩu hiện tại không đúng");
        }

        // Cập nhật mật khẩu mới
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public java.util.List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream().map(user -> UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .avatarUrl(user.getAvatarUrl())
                .provider(user.getProvider())
                .role(user.getRole())
                .build()).collect(java.util.stream.Collectors.toList());
    }

    public UserProfileResponse updateUserRole(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        user.setRole(role);
        userRepository.save(user);
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .avatarUrl(user.getAvatarUrl())
                .provider(user.getProvider())
                .role(user.getRole())
                .build();
    }
}
