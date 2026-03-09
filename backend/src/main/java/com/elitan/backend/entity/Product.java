package com.elitan.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private BigDecimal price;
    private String imageUrl;
    private String category; // e.g., "Chair", "Sofa", "Lamp"
    private String description;

    // New fields for variants and better cart display
    private String color;
    private String material;
    private String dimensions; // L x W x H
    @Builder.Default
    private Integer stock = 10;
    private String thumbnailUrl;
}
