package com.elitan.backend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SchemaInitializer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        log.info("ÉLITAN Schema Initializer: Verifying wishlist table...");
        try {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS wishlist (" +
                    "id BIGINT AUTO_INCREMENT PRIMARY KEY," +
                    "user_id BIGINT NOT NULL," +
                    "product_id BIGINT NOT NULL," +
                    "created_at DATETIME," +
                    "CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id)," +
                    "CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id) REFERENCES product(id)" +
                    ")");
            log.info("ÉLITAN Schema Initializer: Wishlist table is ready.");
        } catch (Exception e) {
            log.warn("ÉLITAN Schema Initializer: Table initialization note: " + e.getMessage());
        }
    }
}
