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
public class CartItemResponse {
    private Long id;
    private Long productId;
    private Long variantId;
    private String name;
    private String category;
    private BigDecimal price;
    private String imageUrl;
    private String thumbnailUrl;
    private String color;
    private String material;
    private String dimensions;
    private Integer quantity;
    private BigDecimal itemTotal;
}
