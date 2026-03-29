package com.elitan.backend.repository;

import com.elitan.backend.entity.Product;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ProductSpecification {

    public static Specification<Product> hasName(String name) {
        return (root, query, cb) -> (name == null || name.trim().isEmpty()) ? null : cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Product> hasCategory(String category) {
        return (root, query, cb) -> (category == null || category.trim().isEmpty()) ? null : cb.equal(cb.lower(root.get("category")), category.toLowerCase());
    }

    public static Specification<Product> hasMaterial(String material) {
        return (root, query, cb) -> (material == null || material.trim().isEmpty()) ? null : cb.equal(cb.lower(root.get("material")), material.toLowerCase());
    }

    public static Specification<Product> hasColor(String color) {
        return (root, query, cb) -> (color == null || color.trim().isEmpty()) ? null : cb.equal(cb.lower(root.get("color")), color.toLowerCase());
    }

    public static Specification<Product> hasPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (minPrice == null && maxPrice == null) return null;
            if (minPrice != null && maxPrice != null) return cb.between(root.get("price"), minPrice, maxPrice);
            if (minPrice != null) return cb.greaterThanOrEqualTo(root.get("price"), minPrice);
            return cb.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }
}
