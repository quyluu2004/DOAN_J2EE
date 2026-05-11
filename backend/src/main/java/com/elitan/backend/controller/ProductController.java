package com.elitan.backend.controller;

import com.elitan.backend.entity.Product;
import com.elitan.backend.service.ProductService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@lombok.extern.slf4j.Slf4j
public class ProductController {
    private final ProductService productService;
    private final com.elitan.backend.service.WishlistService wishlistService;

    public ProductController(ProductService productService, com.elitan.backend.service.WishlistService wishlistService) {
        this.productService = productService;
        this.wishlistService = wishlistService;
    }

    private String getUserEmail(org.springframework.security.core.Authentication authentication) {
        if (authentication == null) return null;
        return authentication.getName();
    }

    @GetMapping("/wishlist")
    public ResponseEntity<?> getWishlist(org.springframework.security.core.Authentication authentication) {
        try {
            String email = getUserEmail(authentication);
            if (email == null) return ResponseEntity.status(401).body(java.util.Map.of("error", "Unauthorized"));
            return ResponseEntity.ok(wishlistService.getUserWishlist(email));
        } catch (Exception e) {
            log.error("Error getting wishlist in ProductController: ", e);
            return ResponseEntity.status(500).body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/wishlist/{productId}")
    public ResponseEntity<?> toggleWishlist(
            org.springframework.security.core.Authentication authentication,
            @PathVariable Long productId) {
        try {
            String email = getUserEmail(authentication);
            if (email == null) return ResponseEntity.status(401).body(java.util.Map.of("error", "Unauthorized"));
            wishlistService.toggleWishlist(email, productId);
            return ResponseEntity.ok(java.util.Map.of("message", "Wishlist updated"));
        } catch (Exception e) {
            log.error("Error toggling wishlist in ProductController: ", e);
            return ResponseEntity.status(500).body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/search")
    public ResponseEntity<org.springframework.data.domain.Page<Product>> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String material,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sort, // Support 'sort' parameter from frontend
            @RequestParam(defaultValue = "desc") String direction) {
        
        String finalSortBy = (sort != null) ? sort : (sortBy != null ? sortBy : "id");
        
        Sort.Direction dir = direction.equalsIgnoreCase("desc") ?
                Sort.Direction.DESC : Sort.Direction.ASC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, finalSortBy));
        
        return ResponseEntity.ok(productService.searchProducts(name, category, material, color, minPrice, maxPrice, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
}
