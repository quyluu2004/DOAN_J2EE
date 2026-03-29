package com.elitan.backend.controller;

import com.elitan.backend.entity.Collection;
import com.elitan.backend.service.CollectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
public class CollectionController {
    private final CollectionService collectionService;

    @GetMapping
    public ResponseEntity<List<Collection>> getAllCollections() {
        return ResponseEntity.ok(collectionService.getAllCollections());
    }

    // Admin endpoints
    @PostMapping
    public ResponseEntity<Collection> createCollection(@RequestBody Collection collection) {
        return ResponseEntity.ok(collectionService.createCollection(collection));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Collection> updateCollection(@PathVariable Long id, @RequestBody Collection collection) {
        return ResponseEntity.ok(collectionService.updateCollection(id, collection));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollection(@PathVariable Long id) {
        collectionService.deleteCollection(id);
        return ResponseEntity.ok().build();
    }
}
