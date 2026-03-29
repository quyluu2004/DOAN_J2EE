package com.elitan.backend.repository;

import com.elitan.backend.entity.ImportHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImportHistoryRepository extends JpaRepository<ImportHistory, Long> {
}
