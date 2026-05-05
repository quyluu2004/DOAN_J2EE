package com.elitan.backend.repository;

import com.elitan.backend.entity.WebsiteVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WebsiteVisitRepository extends JpaRepository<WebsiteVisit, Long> {
}
