package com.elitan.backend.controller;

import com.elitan.backend.entity.Material;
import com.elitan.backend.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
@CrossOrigin(origins = "https://localhost:5173")
@RequiredArgsConstructor
public class MaterialController {
    private final MaterialService materialService;

    @GetMapping
    public ResponseEntity<List<Material>> getAllMaterials() {
        return ResponseEntity.ok(materialService.getAllMaterials());
    }

    @PostMapping
    public ResponseEntity<Material> createMaterial(@RequestBody Material material) {
        return ResponseEntity.ok(materialService.createMaterial(material));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Material> updateMaterial(@PathVariable Long id, @RequestBody Material material) {
        return ResponseEntity.ok(materialService.updateMaterial(id, material));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.ok().build();
    }
}
