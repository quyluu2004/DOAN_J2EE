package com.elitan.backend.service;

import com.elitan.backend.dto.AuthResponse;
import com.elitan.backend.dto.LoginRequest;
import com.elitan.backend.dto.RegisterRequest;
import com.elitan.backend.dto.SocialLoginRequest;
import com.elitan.backend.entity.User;
import com.elitan.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RestTemplate restTemplate; // Inject Bean thay vì tạo mới mỗi lần

    public AuthService(UserRepository userRepository, 
                       PasswordEncoder passwordEncoder, 
                       JwtService jwtService, 
                       RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.restTemplate = restTemplate;
    }

    @Value("${google.client-id}")
    private String googleClientId;

    @Value("${facebook.app-id}")
    private String facebookAppId;

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
                .provider("LOCAL")
                .build();

        userRepository.save(user);

        // Tạo JWT token cho user vừa đăng ký (auto-login sau đăng ký)
        String token = jwtService.generateToken(user.getEmail(), user.getRole(), user.getFullName());

        return AuthResponse.builder()
                .token(token)
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

        // Kiểm tra user có password không (social login user không có password)
        if (user.getPasswordHash() == null || user.getPasswordHash().isEmpty()) {
            throw new RuntimeException("Tài khoản này đã đăng ký bằng " + user.getProvider()
                    + ". Vui lòng đăng nhập bằng " + user.getProvider() + ".");
        }

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

    // Đăng nhập bằng Google hoặc Facebook
    public AuthResponse socialLogin(SocialLoginRequest request) {
        String email;
        String fullName;
        String providerId;
        String provider = request.getProvider().toUpperCase();

        switch (provider) {
            case "GOOGLE":
                Map<String, String> googleInfo = verifyGoogleToken(request.getToken());
                email = googleInfo.get("email");
                fullName = googleInfo.get("name");
                providerId = googleInfo.get("sub");
                break;
            case "FACEBOOK":
                Map<String, String> fbInfo = verifyFacebookToken(request.getToken());
                email = fbInfo.get("email");
                fullName = fbInfo.get("name");
                providerId = fbInfo.get("id");

                // Kiểm tra nếu Facebook không trả email
                if (email == null || email.isEmpty()) {
                    throw new RuntimeException(
                            "Tài khoản Facebook của bạn không có email. Vui lòng cập nhật email trên Facebook hoặc đăng ký bằng email.");
                }
                break;
            default:
                throw new RuntimeException("Provider không hỗ trợ: " + provider);
        }

        // Tìm user theo provider + providerId
        Optional<User> existingUser = userRepository.findByProviderAndProviderId(provider, providerId);

        User user;
        if (existingUser.isPresent()) {
            // User đã tồn tại → đăng nhập
            user = existingUser.get();
        } else {
            // Kiểm tra email đã tồn tại chưa
            Optional<User> userByEmail = userRepository.findByEmail(email);
            if (userByEmail.isPresent()) {
                // Email đã dùng → chỉ liên kết providerId, KHÔNG ghi đè provider
                // Giữ nguyên provider gốc để user vẫn login bằng password được
                user = userByEmail.get();
                if (user.getProviderId() == null || user.getProviderId().isEmpty()) {
                    user.setProviderId(providerId);
                    userRepository.save(user);
                }
            } else {
                // Tạo user mới (auto-register)
                user = User.builder()
                        .email(email)
                        .fullName(fullName)
                        .role("USER")
                        .provider(provider)
                        .providerId(providerId)
                        .build();
                userRepository.save(user);
            }
        }

        // Tạo JWT token
        String token = jwtService.generateToken(user.getEmail(), user.getRole(), user.getFullName());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .message("Đăng nhập bằng " + provider + " thành công!")
                .build();
    }

    // Xác minh Google Access Token bằng Google Userinfo API
    @SuppressWarnings("unchecked")
    private Map<String, String> verifyGoogleToken(String accessToken) {
        try {
            String url = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken;
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null || !response.containsKey("sub")) {
                throw new RuntimeException("Google token không hợp lệ");
            }

            return Map.of(
                    "email", (String) response.get("email"),
                    "name", (String) response.get("name"),
                    "sub", (String) response.get("sub"));
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xác minh Google token: " + e.getMessage());
        }
    }

    // Xác minh Facebook Access Token
    @SuppressWarnings("unchecked")
    private Map<String, String> verifyFacebookToken(String accessToken) {
        try {
            String url = "https://graph.facebook.com/me?fields=id,name,email&access_token=" + accessToken;
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null || !response.containsKey("id")) {
                throw new RuntimeException("Facebook token không hợp lệ");
            }

            return Map.of(
                    "id", (String) response.get("id"),
                    "name", (String) response.get("name"),
                    "email", response.containsKey("email") ? (String) response.get("email") : "");
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xác minh Facebook token: " + e.getMessage());
        }
    }
}
