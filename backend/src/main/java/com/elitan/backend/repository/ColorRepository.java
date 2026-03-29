package com.elitan.backend.repository;

import com.elitan.backend.entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ColorRepository extends JpaRepository<Color, Long> {
    Optional<Color> findByNameIgnoreCase(String name);
}
