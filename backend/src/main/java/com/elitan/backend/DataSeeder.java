package com.elitan.backend;

import com.elitan.backend.entity.Collection;
import com.elitan.backend.entity.Product;
import com.elitan.backend.repository.CollectionRepository;
import com.elitan.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CollectionRepository collectionRepository;

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            seedProducts();
        }
        if (collectionRepository.count() == 0) {
            seedCollections();
        }
    }

    private void seedCollections() {
        collectionRepository.saveAll(Arrays.asList(
            Collection.builder()
                .name("LIVING ROOM")
                .type("LIVING_ROOM")
                .imageUrl("https://images.unsplash.com/photo-1540573133985-cd9118355ae0?q=80&w=1000&auto=format&fit=crop") // Placeholder
                .build(),
            Collection.builder()
                .name("DINING")
                .type("DINING")
                .imageUrl("https://images.unsplash.com/photo-1579725942955-4d8377f8c66a?q=80&w=1000&auto=format&fit=crop") // Placeholder
                .build(),
            Collection.builder()
                .name("BEDROOM")
                .type("BEDROOM")
                .imageUrl("https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=1000&auto=format&fit=crop") // Placeholder
                .build()
        ));
    }

    private void seedProducts() {
        productRepository.saveAll(Arrays.asList(
            Product.builder()
                .name("Luna Lounge Chair")
                .price(new BigDecimal("1299"))
                .imageUrl("https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop")
                .category("Chair")
                .description("Elegant lounge chair")
                .build(),
            Product.builder()
                .name("Luna Lounge Chair")
                .price(new BigDecimal("1299"))
                .imageUrl("https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?q=80&w=1000&auto=format&fit=crop")
                .category("Chair")
                .description("Another elegant variation")
                .build(),
            Product.builder()
                .name("Grey Fabric")
                .price(new BigDecimal("1299"))
                .imageUrl("https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1000&auto=format&fit=crop")
                .category("Chair")
                .description("Comfortable grey fabric chair")
                .build(),
            Product.builder()
                .name("Grey Fabric")
                .price(new BigDecimal("1299"))
                .imageUrl("https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop")
                .category("Sofa")
                .description("Comfortable grey fabric sofa")
                .build()
        ));
    }
}
