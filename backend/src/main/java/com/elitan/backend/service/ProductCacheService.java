package com.elitan.backend.service;

import com.elitan.backend.entity.Product;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class ProductCacheService {
    private final RedisTemplate<String, Object> redisTemplate;
    private static final String PRODUCT_KEY_PREFIX = "product:";

    public ProductCacheService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void cacheProduct(Product product) {
        String key = PRODUCT_KEY_PREFIX + product.getId();
        redisTemplate.opsForValue().set(key, product, 1, TimeUnit.HOURS);
    }

    public Product getCachedProduct(Long id) {
        String key = PRODUCT_KEY_PREFIX + id;
        return (Product) redisTemplate.opsForValue().get(key);
    }

    public void evictProduct(Long id) {
        String key = PRODUCT_KEY_PREFIX + id;
        redisTemplate.delete(key);
    }

    public void clearAllCaches() {
        redisTemplate.getConnectionFactory().getConnection().flushAll();
    }
}
