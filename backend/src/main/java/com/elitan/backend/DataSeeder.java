package com.elitan.backend;

import com.elitan.backend.entity.Collection;
import com.elitan.backend.entity.Product;
import com.elitan.backend.repository.CollectionRepository;
import com.elitan.backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

        private final ProductRepository productRepository;
        private final CollectionRepository collectionRepository;
        private final com.elitan.backend.repository.ColorRepository colorRepository;
        private final com.elitan.backend.repository.MaterialRepository materialRepository;
        private final com.elitan.backend.repository.ReviewRepository reviewRepository;
        private final com.elitan.backend.repository.WishlistRepository wishlistRepository;
        private final com.elitan.backend.repository.CartItemRepository cartItemRepository;
        private final com.elitan.backend.repository.OrderDetailRepository orderDetailRepository;

        public DataSeeder(ProductRepository productRepository, CollectionRepository collectionRepository, 
                          com.elitan.backend.repository.ColorRepository colorRepository,
                          com.elitan.backend.repository.MaterialRepository materialRepository,
                          com.elitan.backend.repository.ReviewRepository reviewRepository,
                          com.elitan.backend.repository.WishlistRepository wishlistRepository,
                          com.elitan.backend.repository.CartItemRepository cartItemRepository,
                          com.elitan.backend.repository.OrderDetailRepository orderDetailRepository) {
                this.productRepository = productRepository;
                this.collectionRepository = collectionRepository;
                this.colorRepository = colorRepository;
                this.materialRepository = materialRepository;
                this.reviewRepository = reviewRepository;
                this.wishlistRepository = wishlistRepository;
                this.cartItemRepository = cartItemRepository;
                this.orderDetailRepository = orderDetailRepository;
        }

        @Override
        public void run(String... args) throws Exception {
                if (colorRepository.count() == 0) {
                        seedColors();
                }
                if (materialRepository.count() == 0) {
                        seedMaterials();
                }
                
                // Re-seed if count is small or categories are old
                if (productRepository.count() < 4 || productRepository.findByCategory("Chair").size() > 0) {
                        reviewRepository.deleteAll();
                        wishlistRepository.deleteAll();
                        cartItemRepository.deleteAll();
                        orderDetailRepository.deleteAll();
                        productRepository.deleteAll();
                        seedProducts();
                }
                
                // Fix existing null stocks and ratings and missing variants
                java.util.List<com.elitan.backend.entity.Product> allProducts = productRepository.findAll();
                for (int i = 0; i < allProducts.size(); i++) {
                        com.elitan.backend.entity.Product p = allProducts.get(i);
                        boolean changed = false;
                        if (p.getStock() == null) {
                                p.setStock(10);
                                changed = true;
                        }
                        if (p.getAverageRating() == null || p.getAverageRating() == 0.0) {
                                if (i == 0) p.setAverageRating(5.0);
                                else if (i == 1) p.setAverageRating(4.9);
                                else if (i == 2) p.setAverageRating(4.8);
                                else p.setAverageRating(3.5 + (Math.random() * 1.0));
                                changed = true;
                        }
                        
                        // Auto-create default variant if none exists
                        if (p.getVariants() == null || p.getVariants().isEmpty()) {
                                com.elitan.backend.entity.ProductVariant v = com.elitan.backend.entity.ProductVariant.builder()
                                                .product(p)
                                                .color(p.getColor() != null ? p.getColor() : "Default")
                                                .stock(p.getStock() != null ? p.getStock() : 10)
                                                .imageUrl(p.getImageUrl())
                                                .build();
                                if (p.getVariants() == null) {
                                        p.setVariants(new java.util.ArrayList<>());
                                }
                                p.getVariants().add(v);
                                changed = true;
                        }

                        if (changed) productRepository.save(p);
                }

                if (collectionRepository.count() == 0) {
                        seedCollections();
                }
        }

        private void seedCollections() {
                collectionRepository.saveAll(Arrays.asList(
                                Collection.builder().name("LIVING ROOM").type("LIVING_ROOM").imageUrl("https://images.unsplash.com/photo-1540573133985-cd9118355ae0?q=80&w=1000&auto=format&fit=crop").build(),
                                Collection.builder().name("DINING").type("DINING").imageUrl("https://images.unsplash.com/photo-1579725942955-4d8377f8c66a?q=80&w=1000&auto=format&fit=crop").build(),
                                Collection.builder().name("BEDROOM").type("BEDROOM").imageUrl("https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=1000&auto=format&fit=crop").build()));
        }

        private void seedProducts() {
                productRepository.saveAll(Arrays.asList(
                                Product.builder()
                                                .name("Luna Lounge Chair")
                                                .price(new BigDecimal("1299"))
                                                .imageUrl("https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop")
                                                .category("Living Room")
                                                .description("Elegant lounge chair")
                                                .color("Natural")
                                                .material("Wood")
                                                .stock(10)
                                                .build(),
                                Product.builder()
                                                .name("Modern Sofa")
                                                .price(new BigDecimal("2299"))
                                                .imageUrl("https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop")
                                                .category("Living Room")
                                                .description("Comfortable grey fabric sofa")
                                                .color("Grey")
                                                .material("Fabric")
                                                .stock(5)
                                                .build(),
                                Product.builder()
                                                .name("Dining Table")
                                                .price(new BigDecimal("1899"))
                                                .imageUrl("https://images.unsplash.com/photo-1579725942955-4d8377f8c66a?q=80&w=1000&auto=format&fit=crop")
                                                .category("Dining")
                                                .description("Solid wood dining table")
                                                .color("Natural")
                                                .material("Wood")
                                                .stock(8)
                                                .build(),
                                Product.builder()
                                                .name("Velvet Armchair")
                                                .price(new BigDecimal("899"))
                                                .imageUrl("https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1000&auto=format&fit=crop")
                                                .category("Living Room")
                                                .description("Green velvet armchair")
                                                .color("Green")
                                                .material("Fabric")
                                                .stock(12)
                                                .build()));
        }

        private void seedColors() {
                colorRepository.saveAll(Arrays.asList(
                        com.elitan.backend.entity.Color.builder().name("Natural").hexCode("#e5c09e").build(),
                        com.elitan.backend.entity.Color.builder().name("Black").hexCode("#000000").build(),
                        com.elitan.backend.entity.Color.builder().name("White").hexCode("#ffffff").build(),
                        com.elitan.backend.entity.Color.builder().name("Cognac").hexCode("#9b4d1c").build(),
                        com.elitan.backend.entity.Color.builder().name("Grey").hexCode("#808080").build(),
                        com.elitan.backend.entity.Color.builder().name("Green").hexCode("#008000").build()
                ));
        }

        private void seedMaterials() {
                materialRepository.saveAll(Arrays.asList(
                        com.elitan.backend.entity.Material.builder().name("Wood").build(),
                        com.elitan.backend.entity.Material.builder().name("Metal").build(),
                        com.elitan.backend.entity.Material.builder().name("Leather").build(),
                        com.elitan.backend.entity.Material.builder().name("Fabric").build(),
                        com.elitan.backend.entity.Material.builder().name("Glass").build(),
                        com.elitan.backend.entity.Material.builder().name("Stone").build()
                ));
        }
}
