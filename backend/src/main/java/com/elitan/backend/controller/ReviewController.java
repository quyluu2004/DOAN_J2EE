package com.elitan.backend.controller;

import com.elitan.backend.entity.Review;
import com.elitan.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/product/{productId}")
    public ResponseEntity<Review> addReview(
            Authentication authentication,
            @PathVariable Long productId,
            @RequestBody Map<String, Object> request) {
        
        int rating = (int) request.get("rating");
        String comment = (String) request.get("comment");
        
        Review review = reviewService.addReview(authentication.getName(), productId, rating, comment);
        return ResponseEntity.ok(review);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }
}
