package com.elitan.backend.controller;

import com.elitan.backend.entity.WebsiteVisit;
import com.elitan.backend.repository.OrderRepository;
import com.elitan.backend.repository.WebsiteVisitRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    @Autowired
    private WebsiteVisitRepository visitRepository;

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/visit")
    public ResponseEntity<?> recordVisit(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }
        String userAgent = request.getHeader("User-Agent");

        // Để tránh spam, có thể lọc IP hoặc kiểm tra session, 
        // nhưng với đồ án thì lưu mọi request vào trang chủ là đủ.
        WebsiteVisit visit = WebsiteVisit.builder()
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .build();
        visitRepository.save(visit);
        
        return ResponseEntity.ok(Map.of("message", "Visit recorded"));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        long totalVisits = visitRepository.count();
        long totalOrders = orderRepository.countValidOrders();
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalVisits", totalVisits);
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue);
        
        return ResponseEntity.ok(stats);
    }
}
