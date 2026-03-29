package com.elitan.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailResponse {
    private Long id;
    private Long productId;
    private Long variantId;
    private String productName;
    private String productImage;
    private String color;
    private String material;
    private String dimensions;
    private Integer quantity;
    private BigDecimal priceAtPurchase;
    private BigDecimal itemTotal;
}
