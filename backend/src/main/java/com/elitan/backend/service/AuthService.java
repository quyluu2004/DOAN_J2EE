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
    private final RestTemplate restTemplate;

    private final DiscordService discordService;

    public AuthService(UserRepository userRepository, 
                       PasswordEncoder passwordEncoder, 
                       JwtService jwtService, 
                       RestTemplate restTemplate,
                       DiscordService discordService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.restTemplate = restTemplate;
        this.discordService = discordService;
    }

    @Value("${google.client-id}")
    private String googleClientId;

    @Value("${facebook.app-id}")
    private String facebookAppId;

    // Đăng ký tài khoản mới
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng: " + request.getEmail());
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(hashedPassword)
                .fullName(request.getFullName())
                .role("USER")
                .provider("LOCAL")
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), user.getRole(), user.getFullName());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .message("Đăng ký thành công!")
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }

    // Đăng nhập
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không đúng"));

        if (user.getPasswordHash() == null || user.getPasswordHash().isEmpty()) {
            throw new RuntimeException("Tài khoản này đã đăng ký bằng " + user.getProvider()
                    + ". Vui lòng đăng nhập bằng " + user.getProvider() + ".");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Email hoặc mật khẩu không đúng");
        }

        // Kiểm tra 2FA
        if (user.isTwoFactorEnabled()) {
            if (user.getDiscordUserId() == null) {
                throw new RuntimeException("Tài khoản chưa được liên kết Discord để nhận OTP 2FA.");
            }

            // Sinh mã OTP 6 số
            String otp = String.format("%06d", new java.security.SecureRandom().nextInt(1000000));
            user.setTwoFactorCode(otp);
            user.setTwoFactorExpiry(java.time.LocalDateTime.now().plusMinutes(5));
            userRepository.save(user);

            // Gửi OTP qua Discord
            discordService.sendMessage(user.getDiscordUserId(), 
                "**Mã OTP đăng nhập ÉLITAN của bạn là: ** `" + otp + "`\n" +
                "Mã này sẽ hết hạn sau 5 phút.");

            return AuthResponse.builder()
                    .twoFactorRequired(true)
                    .email(user.getEmail())
                    .message("Vui lòng nhập mã OTP đã gửi qua Discord của bạn.")
                    .build();
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole(), user.getFullName());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .message("Đăng nhập thành công!")
                .build();
    }

    // Xác thực 2FA
    public AuthResponse verify2FA(com.elitan.backend.dto.Verify2FARequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (!user.isTwoFactorEnabled()) {
            throw new RuntimeException("Tài khoản này chưa bật 2FA");
        }

        if (user.getTwoFactorCode() == null || !user.getTwoFactorCode().equals(request.getCode())) {
            throw new RuntimeException("Mã OTP không đúng");
        }

        if (user.getTwoFactorExpiry() == null || user.getTwoFactorExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Mã OTP đã hết hạn");
        }

        // Xóa mã sau khi dùng
        user.setTwoFactorCode(null);
        user.setTwoFactorExpiry(null);
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), user.getRole(), user.getFullName());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .message("Xác minh 2FA thành công!")
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

                if (email == null || email.isEmpty()) {
                    throw new RuntimeException(
                            "Tài khoản Facebook của bạn không có email. Vui lòng cập nhật email trên Facebook hoặc đăng ký bằng email.");
                }
                break;
            default:
                throw new RuntimeException("Provider không hỗ trợ: " + provider);
        }

        Optional<User> existingUser = userRepository.findByProviderAndProviderId(provider, providerId);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            Optional<User> userByEmail = userRepository.findByEmail(email);
            if (userByEmail.isPresent()) {
                user = userByEmail.get();
                // BẢO MẬT: Kiểm tra provider trước khi gộp tài khoản
                // Nếu tài khoản cũ đăng ký LOCAL (bằng email/password), không cho social login gộp vào
                if ("LOCAL".equals(user.getProvider()) && !provider.equals("LOCAL")) {
                    throw new RuntimeException(
                        "Email này đã được đăng ký bằng mật khẩu. Vui lòng đăng nhập bằng email và mật khẩu, hoặc sử dụng email khác.");
                }
                // Nếu cùng provider nhưng chưa có providerId (dữ liệu cũ) → cập nhật
                if (user.getProvider().equals(provider) && (user.getProviderId() == null || user.getProviderId().isEmpty())) {
                    user.setProviderId(providerId);
                    userRepository.save(user);
                }
            } else {
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

        // Kiểm tra 2FA
        if (user.isTwoFactorEnabled()) {
            if (user.getDiscordUserId() == null || user.getDiscordUserId().isEmpty()) {
                // BẢO MẬT: 2FA bật nhưng chưa liên kết Discord → từ chối đăng nhập
                throw new RuntimeException(
                    "Tài khoản này đã bật xác thực 2 lớp nhưng chưa liên kết Discord. " +
                    "Vui lòng đăng nhập bằng mật khẩu và liên kết Discord trong phần cài đặt.");
            } else {
                // Sinh mã OTP 6 số
                String otp = String.format("%06d", new java.security.SecureRandom().nextInt(1000000));
                user.setTwoFactorCode(otp);
                user.setTwoFactorExpiry(java.time.LocalDateTime.now().plusMinutes(5));
                userRepository.save(user);

                // Gửi OTP qua Discord
                discordService.sendMessage(user.getDiscordUserId(), 
                    "**Mã OTP đăng nhập ÉLITAN (Social) của bạn là: ** `" + otp + "`\n" +
                    "Mã này sẽ hết hạn sau 5 phút.");

                return AuthResponse.builder()
                        .twoFactorRequired(true)
                        .email(user.getEmail())
                        .message("Vui lòng nhập mã OTP đã gửi qua Discord của bạn.")
                        .build();
            }
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole(), user.getFullName());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .message("Đăng nhập bằng " + provider + " thành công!")
                .build();
    }

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

    public AuthResponse generateNewAccessToken(String refreshToken) {
        if (!jwtService.isTokenValid(refreshToken)) {
            throw new RuntimeException("Refresh token đã hết hạn hoặc không hợp lệ");
        }
        String email = jwtService.extractEmail(refreshToken);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
        
        String token = jwtService.generateToken(user.getEmail(), user.getRole(), user.getFullName());
        String newRefreshToken = jwtService.generateRefreshToken(user.getEmail());
        
        return AuthResponse.builder()
                .token(token)
                .refreshToken(newRefreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .message("Token refreshed")
                .build();
    }
}
