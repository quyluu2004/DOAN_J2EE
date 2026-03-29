package com.elitan.backend.service;

import com.elitan.backend.entity.RoomDesign;
import com.elitan.backend.repository.RoomDesignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoomDesignService {
    private final RoomDesignRepository roomDesignRepository;

    @Transactional
    public RoomDesign saveDesign(RoomDesign design) {
        return roomDesignRepository.save(design);
    }

    public List<RoomDesign> getDesignsByUserId(Long userId) {
        return roomDesignRepository.findByUser_Id(userId);
    }

    public Optional<RoomDesign> getDesignById(Long id) {
        return roomDesignRepository.findById(id);
    }

    @Transactional
    public void deleteDesign(Long id) {
        roomDesignRepository.deleteById(id);
    }
}
