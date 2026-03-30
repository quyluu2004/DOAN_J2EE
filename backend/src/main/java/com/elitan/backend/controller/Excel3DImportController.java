package com.elitan.backend.controller;

import com.elitan.backend.service.Excel3DImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/import-3d")
@RequiredArgsConstructor
public class Excel3DImportController {

    private final Excel3DImportService excel3DImportService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> import3DModels(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File Excel không được để trống!"));
        }
        
        Map<String, Object> result = excel3DImportService.import3DModels(file);
        return ResponseEntity.ok(result);
    }
}
