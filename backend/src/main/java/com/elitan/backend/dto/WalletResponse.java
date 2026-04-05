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
public class WalletResponse {
    private Long id;
    private BigDecimal balance;
    private Boolean vip;
    private LocalDateTime vipExpiresAt;
    private List<WalletTransactionResponse> transactions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WalletTransactionResponse {
        private Long id;
        private String type;
        private BigDecimal amount;
        private String description;
        private LocalDateTime createdAt;
    }
}
