package com.elitan.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, ignoreUnknown = true)
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
    
    // Review stats
    @Builder.Default
    private Double averageRating = 0.0;
    @Builder.Default
    private Integer reviewCount = 0;

    // 3D Model URL (Cloudinary)
    private String glbUrl;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<ProductVariant> variants = new ArrayList<>();
}
