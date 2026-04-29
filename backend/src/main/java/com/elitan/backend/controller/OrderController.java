package com.elitan.backend.controller;

import com.elitan.backend.dto.OrderRequest;
import com.elitan.backend.dto.OrderResponse;
import com.elitan.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Slf4j
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    private String getUserEmail(Authentication authentication) {
        return authentication.getName();
    }

    // Trigger OTP gửi qua Email
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body(java.util.Map.of("error", "Vui lòng đăng nhập để nhận mã OTP"));
            }
            String email = getUserEmail(authentication);
            
            // Gửi OTP tới email của user và dùng email làm key để verify sau này
            orderService.sendCheckoutOTP(email, email); 
            
            return ResponseEntity.ok(java.util.Map.of("message", "Mã OTP đã được gửi tới " + email));
        } catch (Exception e) {
            log.error("Error sending OTP: ", e);
            return ResponseEntity.status(500).body(java.util.Map.of("error", e.getMessage()));
        }
    }

    // Tạo đơn hàng mới (Checkout)
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            Authentication authentication,
            @Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(getUserEmail(authentication), request));
    }

    // Lấy danh sách đơn hàng của user
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getUserOrders(getUserEmail(authentication)));
    }

    // Lấy chi tiết 1 đơn hàng
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderDetails(
            Authentication authentication,
            @PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderDetails(getUserEmail(authentication), orderId));
    }

    // Hủy đơn hàng
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            Authentication authentication,
            @PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.cancelOrder(getUserEmail(authentication), orderId));
    }

    // --- Admin Endpoints ---
    @GetMapping("/all")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody java.util.Map<String, String> request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, request.get("status")));
    }
}
