package com.elitan.backend.repository;

import com.elitan.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.status != 'CANCELLED'")
    java.math.BigDecimal sumTotalRevenue();

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(o) FROM Order o WHERE o.status != 'CANCELLED'")
    long countValidOrders();

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(o) FROM Order o WHERE o.status NOT IN ('DELIVERED', 'CANCELLED')")
    long countActiveOrders();

    @org.springframework.data.jpa.repository.Query(value = "SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total_price) as revenue " +
            "FROM orders WHERE status != 'CANCELLED' " +
            "GROUP BY month ORDER BY month DESC LIMIT 12", nativeQuery = true)
    java.util.List<Object[]> getMonthlyRevenueNative();
}
