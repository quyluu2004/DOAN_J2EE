package com.elitan.backend.service;

import com.elitan.backend.dto.RoomDesignRequest;
import com.elitan.backend.entity.RoomDesign;
import com.elitan.backend.entity.User;
import com.elitan.backend.repository.RoomDesignRepository;
import com.elitan.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoomDesignService {
    private final RoomDesignRepository roomDesignRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Transactional
    public RoomDesign saveDesign(RoomDesign design) {
        if (design == null) throw new IllegalArgumentException("Design cannot be null");
        return roomDesignRepository.save(design);
    }


    @Transactional
    public RoomDesign saveDesignFromRequest(RoomDesignRequest request, String authHeader) {
        User user = null;
        
        // 1. Try payload userId
        Long requestId = request.getUserId();
        if (requestId != null) {
            Optional<User> userOpt = userRepository.findById(requestId);
            if (userOpt.isPresent()) {
                user = userOpt.get();
            }
        }
        
        // 2. Try JWT fallback
        if (user == null && authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String email = jwtService.extractEmail(token);
                user = userRepository.findByEmail(email).orElse(null);
            } catch (Exception e) {
                // Ignore invalid tokens
            }
        }

        if (user == null) {
            throw new RuntimeException("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
        }
        
        RoomDesign design;
        Long designId = request.getId();
        if (designId != null) {
            design = roomDesignRepository.findById(designId)
                    .orElse(new RoomDesign());
        } else {
            design = new RoomDesign();
        }

        design.setUser(user);
        design.setName(request.getName());
        design.setDesignData(request.getDesignData());
        design.setThumbnailUrl(request.getThumbnailUrl());
        boolean isTpl = request.getTemplate() != null && request.getTemplate();
        design.setTemplate(isTpl);

        return roomDesignRepository.save(design);
    }

    public List<RoomDesign> getDesignsByUserId(Long userId) {
        return roomDesignRepository.findByUser_Id(userId);
    }

    public List<RoomDesign> getTemplates() {
        return roomDesignRepository.findAllTemplates();
    }

    public Optional<RoomDesign> getDesignById(Long id) {
        if (id == null) return Optional.empty();
        return roomDesignRepository.findById(id);
    }


    @Transactional
    public void deleteDesign(Long id) {
        if (id != null) {
            roomDesignRepository.deleteById(id);
        }
    }

}
