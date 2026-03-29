package com.elitan.backend.repository;

import com.elitan.backend.entity.Product;
import com.elitan.backend.entity.User;
import com.elitan.backend.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT w.product FROM Wishlist w WHERE w.user.email = ?1")
    List<Product> findProductsByUserEmail(String email);

    @org.springframework.data.jpa.repository.Query("SELECT w FROM Wishlist w JOIN FETCH w.product WHERE w.user = ?1")
    List<Wishlist> findByUser(User user);

    @org.springframework.data.jpa.repository.Query("SELECT w FROM Wishlist w JOIN FETCH w.product WHERE w.user = ?1 AND w.product.id = ?2")
    java.util.Optional<Wishlist> findByUserAndProductId(User user, Long productId);

    boolean existsByUserAndProductId(User user, Long productId);
    void deleteByUserAndProductId(User user, Long productId);
}
