package com.elitan.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String trackingNumber;
    private String status;
    private BigDecimal totalPrice;
    private BigDecimal shippingFee;
    private BigDecimal depositAmount;
    
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;
    private String shippingMethod;
    private String paymentMethod;
    private String note;
    
    private LocalDateTime createdAt;
    
    private List<OrderDetailResponse> items;
}
