package com.elitan.backend.repository;

import com.elitan.backend.entity.RoomDesign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoomDesignRepository extends JpaRepository<RoomDesign, Long> {
    List<RoomDesign> findByUser_Id(Long userId);
}
