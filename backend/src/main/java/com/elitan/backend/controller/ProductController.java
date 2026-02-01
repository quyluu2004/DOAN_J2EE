package com.elitan.backend.controller;

import com.elitan.backend.entity.Product;
import com.elitan.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    
    @GetMapping("/bestsellers")
    public ResponseEntity<List<Product>> getBestSellers() {
        // Simple mock logic for 'best sellers' pending real sales data
        return ResponseEntity.ok(productService.getAllProducts().stream().limit(4).toList());
    }
}
