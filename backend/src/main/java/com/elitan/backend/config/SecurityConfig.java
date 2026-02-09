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
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
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

                // Cấu hình quyền truy cập
                .authorizeHttpRequests(auth -> auth
                        // Cho phép truy cập tự do các endpoint auth
                        .requestMatchers("/api/auth/**").permitAll()
                        // Cho phép truy cập sản phẩm không cần đăng nhập
                        .requestMatchers("/api/products/**").permitAll()
                        .requestMatchers("/api/collections/**").permitAll()
                        // Các endpoint khác cần xác thực
                        .anyRequest().authenticated())

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
}
