package com.elitan.backend.service;

import com.elitan.backend.entity.Product;
import com.elitan.backend.repository.ProductRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {
    private final EntityManager entityManager;
    private final ProductRepository productRepository;

    public AdminService(EntityManager entityManager, ProductRepository productRepository) {
        this.entityManager = entityManager;
        this.productRepository = productRepository;
    }

    public List<Map<String, Object>> getMonthlyRevenue() {
        String sql = "SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total_price) as revenue " +
                     "FROM orders " +
                     "WHERE status != 'CANCELLED' " +
                     "GROUP BY month " +
                     "ORDER BY month DESC " +
                     "LIMIT 12";
        Query query = entityManager.createNativeQuery(sql);
        List<Object[]> results = query.getResultList();
        
        List<Map<String, Object>> stats = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("month", row[0]);
            map.put("revenue", row[1]);
            stats.add(map);
        }
        return stats;
    }

    public List<Map<String, Object>> getTopSellingProducts() {
        String sql = "SELECT product_id, product_name, SUM(quantity) as total_sold " +
                     "FROM order_details " +
                     "GROUP BY product_id, product_name " +
                     "ORDER BY total_sold DESC " +
                     "LIMIT 5";
        Query query = entityManager.createNativeQuery(sql);
        List<Object[]> results = query.getResultList();

        List<Map<String, Object>> products = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("productId", row[0]);
            map.put("name", row[1]);
            map.put("sold", row[2]);
            products.add(map);
        }
        return products;
    }

    public long getNewCustomersCount() {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);
        String sql = "SELECT COUNT(*) FROM users WHERE created_at >= :start";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("start", startOfMonth);
        return ((Number) query.getSingleResult()).longValue();
    }

    public List<Product> getLowStockProducts() {
        // Threshold: less than 10 items
        return productRepository.findAll().stream()
                .filter(p -> p.getStock() != null && p.getStock() < 10)
                .toList();
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Basic Stats
        stats.put("totalRevenue", getMonthlyRevenue().stream().mapToLong(m -> ((Number)m.get("revenue")).longValue()).sum());
        stats.put("totalProducts", productRepository.count());
        stats.put("totalUsers", entityManager.createNativeQuery("SELECT COUNT(*) FROM users").getSingleResult());
        stats.put("activeOrders", entityManager.createNativeQuery("SELECT COUNT(*) FROM orders WHERE status NOT IN ('DELIVERED', 'CANCELLED')").getSingleResult());

        // Analytics Data
        stats.put("revenueData", getMonthlyRevenue());
        stats.put("topProducts", getTopSellingProducts());
        stats.put("newCustomers", getNewCustomersCount());
        stats.put("lowStock", getLowStockProducts());
        
        return stats;
    }
}
