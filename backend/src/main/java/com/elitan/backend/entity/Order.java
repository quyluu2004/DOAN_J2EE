package com.elitan.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(unique = true, nullable = false)
    private String trackingNumber; // e.g., #ORD-8A2F

    private BigDecimal totalPrice;
    private BigDecimal shippingFee;

    // PENDING, CONFIRMED, PREPARING, SHIPPING, DELIVERED, CANCELLED
    private String status;

    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;

    // STANDARD, WHITE_GLOVE
    private String shippingMethod;

    // COD, MOMO, VNPAY, STRIPE
    private String paymentMethod;
    
    private BigDecimal depositAmount; // For 30% deposit feature
    private String note;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
