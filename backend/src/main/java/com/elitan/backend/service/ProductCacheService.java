package com.elitan.backend.service;

import com.elitan.backend.entity.Product;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class ProductCacheService {
    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;
    private static final String PRODUCT_KEY_PREFIX = "product:";

    public void cacheProduct(Product product) {
        if (redisTemplate == null) return;
        try {
            String key = PRODUCT_KEY_PREFIX + product.getId();
            redisTemplate.opsForValue().set(key, product, 1, TimeUnit.HOURS);
        } catch (Exception e) {
            // Log and ignore to keep app running
        }
    }

    public Product getCachedProduct(Long id) {
        if (redisTemplate == null) return null;
        try {
            String key = PRODUCT_KEY_PREFIX + id;
            return (Product) redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            return null;
        }
    }

    public void evictProduct(Long id) {
        if (redisTemplate == null) return;
        try {
            String key = PRODUCT_KEY_PREFIX + id;
            redisTemplate.delete(key);
        } catch (Exception e) {
            // Ignore
        }
    }

    public void clearAllCaches() {
        if (redisTemplate == null) return;
        try {
            redisTemplate.getConnectionFactory().getConnection().serverCommands().flushAll();
        } catch (Exception e) {
            // Ignore
        }
    }
}
