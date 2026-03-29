package com.elitan.backend.controller;

import com.elitan.backend.entity.Color;
import com.elitan.backend.service.ColorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colors")
@CrossOrigin(origins = "https://localhost:5173")
@RequiredArgsConstructor
public class ColorController {
    private final ColorService colorService;

    @GetMapping
    public ResponseEntity<List<Color>> getAllColors() {
        return ResponseEntity.ok(colorService.getAllColors());
    }

    @PostMapping
    public ResponseEntity<Color> createColor(@RequestBody Color color) {
        return ResponseEntity.ok(colorService.createColor(color));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Color> updateColor(@PathVariable Long id, @RequestBody Color color) {
        return ResponseEntity.ok(colorService.updateColor(id, color));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteColor(@PathVariable Long id) {
        colorService.deleteColor(id);
        return ResponseEntity.ok().build();
    }
}
