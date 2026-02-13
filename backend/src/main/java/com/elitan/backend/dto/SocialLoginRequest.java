package com.elitan.backend.dto;

import lombok.Data;

@Data
public class SocialLoginRequest {
    // ID Token (Google) hoặc Access Token (Facebook)
    private String token;
    // "GOOGLE" hoặc "FACEBOOK"
    private String provider;
}
