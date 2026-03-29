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
public class AdminStatsResponse {
    private BigDecimal totalRevenue;
    private long activeOrders;
    private long totalProducts;
    private long totalUsers;
}
