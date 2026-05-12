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
                
                // Tắt Basic Auth (popup trình duyệt) và Form Login mặc định
                .httpBasic(basic -> basic.disable())
                .formLogin(form -> form.disable())

                .authorizeHttpRequests(auth -> auth
                        // 1. PUBLIC ACCESS
                        // Reviews: chỉ GET (xem) là công khai, POST (viết) cần đăng nhập
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/reviews", "/api/reviews/**").permitAll() 
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/products", "/api/products/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/products/search-by-image", "/api/products/sync-clarifai").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/collections", "/api/collections/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/materials", "/api/materials/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/colors", "/api/colors/**").permitAll()
                        .requestMatchers("/uploads", "/uploads/**").permitAll()
                        // OTP: cần đăng nhập vì controller lấy email từ Authentication
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/orders/send-otp", "/api/orders/verify-otp").authenticated()
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/v1/analytics/visit").permitAll()

                        // 2. WISHLIST — any authenticated user can toggle/view wishlist
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/products/wishlist", "/api/products/wishlist/**").authenticated()
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/products/wishlist/**").authenticated()

                        // 3. ADMIN ACCESS (Must come before broader .authenticated() rules)
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
                        .requestMatchers("/api/admin/**", "/api/stats/**", "/api/v1/analytics/dashboard").hasRole("ADMIN")
                        .requestMatchers("/api/products/import-file", "/api/products/import-status/**").hasRole("ADMIN")

                        // 3. AUTHENTICATED ACCESS
                        .requestMatchers("/api/cart/**").authenticated()
                        .requestMatchers("/api/wishlist/**").authenticated()
                        .requestMatchers("/api/orders/**").authenticated()
                        .requestMatchers("/api/users/profile").authenticated()
                        .requestMatchers("/api/upload", "/api/upload/**").authenticated()
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/reviews", "/api/reviews/**").authenticated()

                        // 4. FRONTEND STATIC FILES + SPA ROUTES (React Router)
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                            "/", "/index.html", "/assets/**", "/favicon.ico", "/vite.svg",
                            "/shop", "/shop/**", "/products/**",
                            "/about", "/contact", "/wishlist",
                            "/login", "/register", "/forgot-password", "/reset-password",
                            "/profile", "/profile/**",
                            "/checkout", "/checkout/**",
                            "/orders", "/orders/**",
                            "/3d-designer", "/my-designs",
                            "/admin", "/admin/**",
                            "/api/designs/templates"
                        ).permitAll()

                        // 5. CATCH ALL — mọi request khác cần authentication
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
