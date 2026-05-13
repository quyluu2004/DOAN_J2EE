package com.elitan.backend.repository;

import com.elitan.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>,
        org.springframework.data.jpa.repository.JpaSpecificationExecutor<Product> {
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"variants"})
    List<Product> findByCategory(String category);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"variants"})
    org.springframework.data.domain.Page<Product> findAll(
            org.springframework.data.jpa.domain.Specification<Product> spec,
            org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"variants"})
    @org.springframework.data.jpa.repository.Query("SELECT p FROM Product p WHERE " +
            "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:category IS NULL OR LOWER(p.category) = LOWER(:category))")
    org.springframework.data.domain.Page<Product> searchProducts(
            @org.springframework.data.repository.query.Param("name") String name,
            @org.springframework.data.repository.query.Param("category") String category,
            org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"variants"})
    @Override
    List<Product> findAll();

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"variants"})
    @Override
    org.springframework.data.domain.Page<Product> findAll(org.springframework.data.domain.Pageable pageable);

    List<Product> findByStockLessThan(Integer threshold);

    java.util.Optional<Product> findByName(String name);

    java.util.Optional<Product> findByNameIgnoreCase(String name);
}
