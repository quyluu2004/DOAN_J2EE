package com.elitan.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Bật CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                // Tắt CSRF vì dùng JWT (stateless)
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // 1. PUBLIC ACCESS
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/products", "/api/products/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/products/search-by-image", "/api/products/sync-clarifai").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/collections", "/api/collections/**").permitAll()
                        .requestMatchers("/uploads", "/uploads/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/orders/send-otp", "/api/orders/verify-otp").permitAll()
                        // MoMo IPN webhook - MoMo server gọi về, không có JWT token
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/payment/momo/ipn").permitAll()

                        // 2. ADMIN ACCESS (Must come before broader .authenticated() rules)
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")
                        
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/collections/**").hasRole("ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/collections/**").hasRole("ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/collections/**").hasRole("ADMIN")
                        
                        .requestMatchers("/api/materials", "/api/materials/**").hasRole("ADMIN")
                        .requestMatchers("/api/colors", "/api/colors/**").hasRole("ADMIN")
                        .requestMatchers("/api/users/all", "/api/users/*/role").hasRole("ADMIN")
                        .requestMatchers("/api/orders/all", "/api/orders/*/status").hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/upload").hasRole("ADMIN")
                        .requestMatchers("/api/products/import-file", "/api/products/import-status/**").hasRole("ADMIN")

                        // 3. AUTHENTICATED ACCESS
                        .requestMatchers("/api/cart/**").authenticated()
                        .requestMatchers("/api/wishlist/**").authenticated()
                        .requestMatchers("/api/orders/**").authenticated()
                        .requestMatchers("/api/users/profile").authenticated()

                        // 4. CATCH ALL
                        .anyRequest().authenticated()
                )

                // Dùng JWT → Stateless (không tạo session)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Thêm JWT filter trước UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Bean mã hóa mật khẩu BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Bean RestTemplate để gọi API bên ngoài (Google, Facebook)
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
