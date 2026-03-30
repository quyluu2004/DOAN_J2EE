package com.elitan.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO returned to Frontend after creating a MoMo payment request.
 * Frontend uses payUrl to redirect the user to MoMo's payment page.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MomoPaymentResponse {
    private boolean success;
    private String payUrl;       // URL to redirect user to MoMo
    private String orderId;      // MoMo's internal orderId (same as requestId)
    private String message;      // Error or success message
    private Integer resultCode;  // MoMo result code (0 = success)
}
