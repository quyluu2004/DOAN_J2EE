package com.elitan.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String refreshToken; // Bỏ JsonIgnore tạm thời để check, hoặc giữ lại nếu chắc chắn
    private Long userId;
    private String email;
    private String fullName;
    private String role;
    private String message;
    private boolean twoFactorRequired;

    // Manual Builder style for compatibility
    public static class AuthResponseBuilder {
        private String token;
        private String refreshToken;
        private Long userId;
        private String email;
        private String fullName;
        private String role;
        private String message;
        private boolean twoFactorRequired;

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder refreshToken(String refreshToken) { this.refreshToken = refreshToken; return this; }
        public AuthResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public AuthResponseBuilder email(String email) { this.email = email; return this; }
        public AuthResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public AuthResponseBuilder role(String role) { this.role = role; return this; }
        public AuthResponseBuilder message(String message) { this.message = message; return this; }
        public AuthResponseBuilder twoFactorRequired(boolean twoFactorRequired) { this.twoFactorRequired = twoFactorRequired; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, refreshToken, userId, email, fullName, role, message, twoFactorRequired);
        }
    }

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }
}
