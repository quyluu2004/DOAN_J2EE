package com.elitan.backend.service;

import com.elitan.backend.dto.AuthResponse;
import com.elitan.backend.dto.LoginRequest;
import com.elitan.backend.dto.RegisterRequest;
import com.elitan.backend.entity.User;
import com.elitan.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // Đăng ký tài khoản mới
    public AuthResponse register(RegisterRequest request) {
        // Kiểm tra email đã tồn tại chưa
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng: " + request.getEmail());
        }

        // Mã hóa mật khẩu bằng BCrypt
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // Tạo user mới
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(hashedPassword)
                .fullName(request.getFullName())
                .role("USER")
                .build();

        userRepository.save(user);

        return AuthResponse.builder()
                .message("Đăng ký thành công!")
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }

    // Đăng nhập
    public AuthResponse login(LoginRequest request) {
        // Tìm user theo email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không đúng"));

        // So sánh mật khẩu đã mã hóa
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Email hoặc mật khẩu không đúng");
        }

        // Tạo JWT token
        String token = jwtService.generateToken(user.getEmail(), user.getRole(), user.getFullName());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .message("Đăng nhập thành công!")
                .build();
    }
}
