package com.elitan.backend.controller;

import com.elitan.backend.dto.AuthResponse;
import com.elitan.backend.dto.LoginRequest;
import com.elitan.backend.dto.RegisterRequest;
import com.elitan.backend.dto.SocialLoginRequest;
import com.elitan.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private void setRefreshTokenCookie(HttpServletResponse res, String refreshToken) {
        if (refreshToken != null) {
            Cookie cookie = new Cookie("refreshToken", refreshToken);
            cookie.setHttpOnly(true);
            cookie.setSecure(true); // Bắt buộc HTTPS trong production
            cookie.setPath("/api/auth/refresh");
            cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
            cookie.setAttribute("SameSite", "Lax"); // Chống CSRF
            res.addCookie(cookie);
        }
    }

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, HttpServletResponse res) {
        try {
            AuthResponse response = authService.register(request);
            setRefreshTokenCookie(res, response.getRefreshToken());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletResponse res) {
        try {
            AuthResponse response = authService.login(request);
            setRefreshTokenCookie(res, response.getRefreshToken());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // POST /api/auth/verify-2fa
    @PostMapping("/verify-2fa")
    public ResponseEntity<?> verify2FA(@RequestBody com.elitan.backend.dto.Verify2FARequest request, HttpServletResponse res) {
        try {
            AuthResponse response = authService.verify2FA(request);
            setRefreshTokenCookie(res, response.getRefreshToken());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // POST /api/auth/social-login (Google / Facebook)
    @PostMapping("/social-login")
    public ResponseEntity<?> socialLogin(@RequestBody SocialLoginRequest request, HttpServletResponse res) {
        try {
            AuthResponse response = authService.socialLogin(request);
            setRefreshTokenCookie(res, response.getRefreshToken());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // POST /api/auth/refresh
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(name = "refreshToken", required = false) String refreshToken, HttpServletResponse res) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Vui lòng đăng nhập lại"));
        }
        try {
            AuthResponse response = authService.generateNewAccessToken(refreshToken);
            setRefreshTokenCookie(res, response.getRefreshToken());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
}
