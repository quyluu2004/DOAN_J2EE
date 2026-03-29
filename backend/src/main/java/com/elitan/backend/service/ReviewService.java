package com.elitan.backend.service;

import com.elitan.backend.entity.Product;
import com.elitan.backend.entity.Review;
import com.elitan.backend.entity.User;
import com.elitan.backend.repository.ProductRepository;
import com.elitan.backend.repository.ReviewRepository;
import com.elitan.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Review addReview(String userEmail, Long productId, int rating, String comment) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(rating)
                .comment(comment)
                .build();

        Review savedReview = reviewRepository.save(review);

        // Update product average rating
        updateProductRating(product);

        return savedReview;
    }

    private void updateProductRating(Product product) {
        List<Review> reviews = reviewRepository.findByProductId(product.getId());
        if (reviews.isEmpty())
            return;

        double avg = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        product.setAverageRating(avg);
        product.setReviewCount(reviews.size());
        productRepository.save(product);
    }

    public List<Review> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductId(productId);
    }
}
