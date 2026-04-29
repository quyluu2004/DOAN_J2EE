package com.elitan.backend.controller;

import com.elitan.backend.dto.RoomDesignRequest;
import com.elitan.backend.entity.RoomDesign;
import com.elitan.backend.service.RoomDesignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/designs")
@RequiredArgsConstructor
public class RoomDesignController {
    private final RoomDesignService roomDesignService;

    @PostMapping
    public ResponseEntity<?> saveDesign(
            @RequestBody RoomDesignRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            return ResponseEntity.ok(roomDesignService.saveDesignFromRequest(request, authHeader));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Unknown error"));
        }
    }

    @GetMapping("/templates")
    public ResponseEntity<List<RoomDesign>> getTemplates() {
        return ResponseEntity.ok(roomDesignService.getTemplates());
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
}
