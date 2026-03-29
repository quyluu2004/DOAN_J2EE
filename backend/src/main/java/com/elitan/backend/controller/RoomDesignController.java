package com.elitan.backend.controller;

import com.elitan.backend.entity.RoomDesign;
import com.elitan.backend.service.RoomDesignService;
import com.elitan.backend.entity.User;
import com.elitan.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/designs")
@RequiredArgsConstructor
public class RoomDesignController {
    private final RoomDesignService roomDesignService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<RoomDesign> saveDesign(@RequestBody RoomDesignRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        RoomDesign design;
        if (request.getId() != null) {
            design = roomDesignService.getDesignById(request.getId())
                    .orElse(new RoomDesign());
        } else {
            design = new RoomDesign();
        }

        design.setUser(user);
        design.setName(request.getName());
        design.setDesignData(request.getDesignData());
        design.setThumbnailUrl(request.getThumbnailUrl());

        return ResponseEntity.ok(roomDesignService.saveDesign(design));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RoomDesign>> getDesignsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(roomDesignService.getDesignsByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDesign> getDesignById(@PathVariable Long id) {
        return roomDesignService.getDesignById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDesign(@PathVariable Long id) {
        roomDesignService.deleteDesign(id);
        return ResponseEntity.ok().build();
    }

    @lombok.Data
    public static class RoomDesignRequest {
        private Long id;
        private Long userId;
        private String name;
        private String designData;
        private String thumbnailUrl;
    }
}
