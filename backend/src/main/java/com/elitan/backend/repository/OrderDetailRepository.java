package com.elitan.backend.repository;

import com.elitan.backend.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findByOrderId(Long orderId);
    List<OrderDetail> findByOrderIdIn(List<Long> orderIds);

    @org.springframework.data.jpa.repository.Query(value = "SELECT product_id, product_name, SUM(quantity) as total_sold " +
            "FROM order_details " +
            "GROUP BY product_id, product_name " +
            "ORDER BY total_sold DESC " +
            "LIMIT 5", nativeQuery = true)
    java.util.List<Object[]> getTopSellingProductsNative();
}
