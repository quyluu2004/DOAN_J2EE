package com.elitan.backend.service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.elitan.backend.entity.Product;
import com.elitan.backend.repository.OrderDetailRepository;
import com.elitan.backend.repository.OrderRepository;
import com.elitan.backend.repository.ProductRepository;
import com.elitan.backend.repository.UserRepository;
import com.elitan.backend.repository.WebsiteVisitRepository;

@Service
@Transactional(readOnly = true)
public class AdminService {
    private final ProductRepository productRepository;
    private final WebsiteVisitRepository websiteVisitRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderDetailRepository orderDetailRepository;

    public AdminService(ProductRepository productRepository,
            WebsiteVisitRepository websiteVisitRepository,
            OrderRepository orderRepository,
            UserRepository userRepository,
            OrderDetailRepository orderDetailRepository) {
        this.productRepository = productRepository;
        this.websiteVisitRepository = websiteVisitRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.orderDetailRepository = orderDetailRepository;
    }

    public List<Map<String, Object>> getMonthlyRevenue() {
        List<Object[]> results = orderRepository.getMonthlyRevenueNative();
        List<Map<String, Object>> stats = new ArrayList<>();

        if (results != null) {
            for (Object[] row : results) {
                if (row != null && row.length >= 2) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("month", row[0]);
                    map.put("revenue", row[1]);
                    stats.add(map);
                }
            }
        }
        return stats;
    }

    public List<Map<String, Object>> getTopSellingProducts() {
        List<Object[]> results = orderDetailRepository.getTopSellingProductsNative();
        List<Map<String, Object>> products = new ArrayList<>();

        if (results != null) {
            for (Object[] row : results) {
                if (row != null && row.length >= 3) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("productId", row[0]);
                    map.put("name", row[1]);
                    map.put("sold", row[2]);
                    products.add(map);
                }
            }
        }
        return products;
    }

    public long getNewCustomersCount() {
        LocalDateTime startOfMonth = LocalDateTime.now()
                .withDayOfMonth(1)
                .with(LocalTime.MIN);
        return userRepository.countByCreatedAtAfter(startOfMonth);
    }

    public List<Map<String, Object>> getLowStockProducts() {
        List<Product> products = productRepository.findByStockLessThan(10);
        List<Map<String, Object>> result = new ArrayList<>();
        if (products != null) {
            for (Product p : products) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", p.getId());
                map.put("name", p.getName());
                map.put("stock", p.getStock());
                map.put("imageUrl", p.getImageUrl());
                result.add(map);
            }
        }
        return result;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        try {
            // Basic Stats
            stats.put("totalProducts", productRepository.count());
            stats.put("totalUsers", userRepository.count());
            stats.put("activeOrders", orderRepository.countActiveOrders());

            // Real-time Analytics
            stats.put("totalVisits", websiteVisitRepository != null ? websiteVisitRepository.count() : 0L);
            stats.put("totalCompletedOrders", orderRepository.countValidOrders());

            // Analytics Data
            List<Map<String, Object>> revenueData = getMonthlyRevenue();
            stats.put("revenueData", revenueData != null ? revenueData : new ArrayList<>());

            long totalRevenue = 0L;
            if (revenueData != null) {
                for (Map<String, Object> m : revenueData) {
                    if (m != null) {
                        Object revObj = m.get("revenue");
                        if (revObj != null && revObj instanceof Number) {
                            totalRevenue += ((Number) revObj).longValue();
                        }
                    }
                }
            }
            stats.put("totalRevenue", totalRevenue);

            stats.put("topProducts", getTopSellingProducts());
            stats.put("newCustomers", getNewCustomersCount());
            stats.put("lowStock", getLowStockProducts());

        } catch (Exception e) {
            // Log the error if possible (fallback to basic data to avoid 500)
            System.err.println("Error in getDashboardStats: " + e.getMessage());
            stats.putIfAbsent("totalProducts", 0L);
            stats.putIfAbsent("totalUsers", 0L);
            stats.putIfAbsent("activeOrders", 0L);
            stats.putIfAbsent("revenueData", new ArrayList<>());
            stats.putIfAbsent("totalRevenue", 0L);
            stats.putIfAbsent("topProducts", new ArrayList<>());
            stats.putIfAbsent("lowStock", new ArrayList<>());
            stats.putIfAbsent("newCustomers", 0L);
            stats.putIfAbsent("totalVisits", 0L);
            stats.putIfAbsent("totalCompletedOrders", 0L);
        }

        return stats;
    }
}
