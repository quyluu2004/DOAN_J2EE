package com.elitan.backend.controller;

import com.elitan.backend.dto.ChangePasswordRequest;
import com.elitan.backend.dto.UpdateProfileRequest;
import com.elitan.backend.dto.UserProfileResponse;
import com.elitan.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "https://localhost:5173")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET /api/users/profile — Lấy thông tin profile (cần JWT)
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            String email = authentication.getName();
            UserProfileResponse profile = userService.getProfile(email);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/users/profile — Cập nhật profile (cần JWT)
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {
        try {
            String email = authentication.getName();
            UserProfileResponse profile = userService.updateProfile(email, request);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/users/change-password — Đổi mật khẩu (cần JWT)
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        try {
            String email = authentication.getName();
            userService.changePassword(email, request);
            return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- Admin Endpoints ---
    @GetMapping("/all")
    public ResponseEntity<java.util.List<UserProfileResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<UserProfileResponse> updateUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(userService.updateUserRole(userId, request.get("role")));
    }
}
