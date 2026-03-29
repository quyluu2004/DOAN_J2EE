package com.elitan.backend.service;

import com.elitan.backend.entity.Product;
import com.elitan.backend.entity.User;
import com.elitan.backend.entity.Wishlist;
import com.elitan.backend.repository.ProductRepository;
import com.elitan.backend.repository.UserRepository;
import com.elitan.backend.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistService {
    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    private final UserRepository userRepository;

    public WishlistService(WishlistRepository wishlistRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void toggleWishlist(String email, Long productId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        java.util.Optional<Wishlist> existing = wishlistRepository.findByUserAndProductId(user, productId);

        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
        } else {
            Wishlist wishlist = Wishlist.builder()
                    .user(user)
                    .product(product)
                    .build();
            wishlistRepository.save(wishlist);
        }
    }

    @Transactional(readOnly = true)
    public List<Product> getUserWishlist(String email) {
        return wishlistRepository.findProductsByUserEmail(email);
    }

    @Transactional(readOnly = true)
    public boolean isProductInWishlist(User user, Long productId) {
        return wishlistRepository.existsByUserAndProductId(user, productId);
    }
}
