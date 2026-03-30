package com.elitan.backend.dto;

import lombok.Data;

/**
 * DTO to receive payment creation request from Frontend.
 * Frontend sends orderId (the internal DB order ID) and amount.
 */
@Data
public class MomoPaymentRequest {
    private Long orderId;   // Internal DB order ID (after order is created)
    private Long amount;    // Amount in VND
    private String orderInfo; // Optional custom note
}
