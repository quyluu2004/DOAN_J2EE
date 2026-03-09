package com.elitan.backend.controller;

import com.elitan.backend.dto.OrderRequest;
import com.elitan.backend.dto.OrderResponse;
import com.elitan.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    private String getUserEmail(Authentication authentication) {
        return authentication.getName();
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
}
