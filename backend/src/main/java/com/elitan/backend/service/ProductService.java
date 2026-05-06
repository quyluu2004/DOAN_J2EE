package com.elitan.backend.service;

import com.elitan.backend.entity.Product;
import com.elitan.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private ProductCacheService productCacheService;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public org.springframework.data.domain.Page<Product> searchProducts(
            String name, String category, String material, String color,
            java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice,
            org.springframework.data.domain.Pageable pageable) {

        org.springframework.data.jpa.domain.Specification<Product> spec = org.springframework.data.jpa.domain.Specification
                .where(
                        com.elitan.backend.repository.ProductSpecification.hasName(name))
                .and(com.elitan.backend.repository.ProductSpecification.hasCategory(category))
                .and(com.elitan.backend.repository.ProductSpecification.hasMaterial(material))
                .and(com.elitan.backend.repository.ProductSpecification.hasColor(color))
                .and(com.elitan.backend.repository.ProductSpecification.hasPriceBetween(minPrice, maxPrice));

        return productRepository.findAll(spec, pageable);
    }

    public Product getProductById(Long id) {
        if (productCacheService != null) {
            Product cached = productCacheService.getCachedProduct(id);
            if (cached != null)
                return cached;
        }

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (productCacheService != null) {
            productCacheService.cacheProduct(product);
        }
        return product;
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public Product createProduct(Product product) {
        if (product.getVariants() != null) {
            product.getVariants().forEach(v -> v.setProduct(product));
        }
        return productRepository.save(product);
    }

    @org.springframework.transaction.annotation.Transactional
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setName(productDetails.getName());
        product.setPrice(productDetails.getPrice());
        product.setImageUrl(productDetails.getImageUrl());
        product.setCategory(productDetails.getCategory());
        product.setDescription(productDetails.getDescription());
        product.setColor(productDetails.getColor());
        product.setMaterial(productDetails.getMaterial());
        product.setDimensions(productDetails.getDimensions());
        product.setStock(productDetails.getStock());
        product.setThumbnailUrl(productDetails.getThumbnailUrl());
        product.setGlbUrl(productDetails.getGlbUrl());

        // Update variants
        if (productDetails.getVariants() != null) {
            product.getVariants().clear();
            productDetails.getVariants().forEach(v -> {
                v.setProduct(product);
                product.getVariants().add(v);
            });
        }

        Product saved = productRepository.save(product);
        if (productCacheService != null) {
            productCacheService.cacheProduct(saved);
        }
        return saved;
    }

    @org.springframework.beans.factory.annotation.Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @org.springframework.transaction.annotation.Transactional
    public void deleteProduct(Long id) {
        // Clear foreign key constraints manually to allow deletion
        jdbcTemplate.update("DELETE FROM reviews WHERE product_id = ?", id);
        jdbcTemplate.update("DELETE FROM wishlist WHERE product_id = ?", id);
        jdbcTemplate.update("DELETE FROM cart_items WHERE product_id = ?", id);
        jdbcTemplate.update("DELETE FROM order_details WHERE product_id = ?", id);

        productRepository.deleteById(id);
        if (productCacheService != null) {
            productCacheService.evictProduct(id);
        }
    }
}
