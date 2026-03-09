package com.elitan.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderRequest {
    @NotBlank(message = "Shipping name is required")
    private String shippingName;

    @NotBlank(message = "Shipping phone is required")
    private String shippingPhone;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    @NotBlank(message = "Shipping method is required (e.g., STANDARD, WHITE_GLOVE)")
    private String shippingMethod;

    @NotBlank(message = "Payment method is required (e.g., COD, VNPAY, STRIPE)")
    private String paymentMethod;
    
    private String note;
}
