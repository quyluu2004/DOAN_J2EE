package com.elitan.backend.service;

import com.elitan.backend.entity.Product;
import com.elitan.backend.repository.ProductRepository;
import com.elitan.backend.repository.WebsiteVisitRepository;
import com.elitan.backend.repository.OrderRepository;
import com.elitan.backend.repository.UserRepository;
import com.elitan.backend.repository.OrderDetailRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
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
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("month", row[0]);
            map.put("revenue", row[1]);
            stats.add(map);
        }
        return stats;
    }

    public List<Map<String, Object>> getTopSellingProducts() {
        List<Object[]> results = orderDetailRepository.getTopSellingProductsNative();

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
        return userRepository.countByCreatedAtAfter(startOfMonth);
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findByStockLessThan(10);
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Basic Stats
        stats.put("totalProducts", productRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("activeOrders", orderRepository.countActiveOrders());

        // Real-time Analytics
        stats.put("totalVisits", websiteVisitRepository.count());
        stats.put("totalCompletedOrders", orderRepository.countValidOrders());

        // Analytics Data
        List<Map<String, Object>> revenueData = getMonthlyRevenue();
        stats.put("revenueData", revenueData != null ? revenueData : new ArrayList<>());
        
        long totalRevenue = 0L;
        if (revenueData != null) {
            for (Map<String, Object> m : revenueData) {
                Object revObj = m.get("revenue");
                if (revObj != null) {
                    if (revObj instanceof Number) {
                        totalRevenue += ((Number) revObj).longValue();
                    }
                }
            }
        }
        stats.put("totalRevenue", totalRevenue);
        
        stats.put("topProducts", getTopSellingProducts() != null ? getTopSellingProducts() : new ArrayList<>());
        stats.put("newCustomers", getNewCustomersCount());
        stats.put("lowStock", getLowStockProducts() != null ? getLowStockProducts() : new ArrayList<>());
        
        return stats;
    }
}
