package com.elitan.backend.controller;

import com.elitan.backend.dto.MomoPaymentRequest;
import com.elitan.backend.dto.MomoPaymentResponse;
import com.elitan.backend.service.MomoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller xử lý các request liên quan đến thanh toán MoMo.
 * Tách biệt hoàn toàn với OrderController hiện có.
 */
@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "https://localhost:5173")
@RequiredArgsConstructor
@Slf4j
public class MomoController {

    private final MomoService momoService;

    /**
     * POST /api/payment/momo/create
     * Frontend gọi endpoint này (cần đăng nhập) để lấy link thanh toán MoMo.
     * Frontend truyền lên { orderId, amount, orderInfo }.
     */
    @PostMapping("/momo/create")
    public ResponseEntity<MomoPaymentResponse> createMomoPayment(
            Authentication authentication,
            @RequestBody MomoPaymentRequest request) {

        if (authentication == null) {
            return ResponseEntity.status(401).body(
                    MomoPaymentResponse.builder()
                            .success(false)
                            .message("Vui lòng đăng nhập để thanh toán")
                            .build()
            );
        }

        log.info("Tạo yêu cầu thanh toán MoMo cho user: {}, orderId: {}, amount: {}",
                authentication.getName(), request.getOrderId(), request.getAmount());

        MomoPaymentResponse response = momoService.createPayment(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/payment/momo/ipn
     * MoMo gọi endpoint này để thông báo kết quả thanh toán (webhook/IPN).
     * KHÔNG yêu cầu xác thực JWT (MoMo gọi trực tiếp từ server của họ).
     * Phải được thêm vào SecurityConfig: .permitAll()
     */
    @PostMapping("/momo/ipn")
    public ResponseEntity<Map<String, String>> handleMomoIpn(@RequestBody Map<String, Object> ipnData) {
        log.info("Nhận MoMo IPN callback: {}", ipnData);
        momoService.handleIpnCallback(ipnData);
        // MoMo yêu cầu phải trả về HTTP 204 hoặc 200 ngay lập tức
        return ResponseEntity.ok(Map.of("status", "received"));
    }

    /**
     * GET /api/payment/momo/return
     * Người dùng được MoMo redirect về URL này sau khi thanh toán xong.
     * Frontend (React Router) sẽ handle route này, backend chỉ cần không chặn nó.
     * Endpoint này chủ yếu để log thông tin return từ MoMo (nếu cần).
     */
    @GetMapping("/momo/return")
    public ResponseEntity<String> handleMomoReturn(
            @RequestParam Map<String, String> params) {
        log.info("Người dùng quay về từ MoMo, params: {}", params);
        // Chỉ log, không xử lý logic ở đây
        // Việc hiển thị giao diện kết quả là của Frontend (React)
        return ResponseEntity.ok("OK");
    }
}
