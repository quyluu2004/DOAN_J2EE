package com.elitan.backend.controller;

import com.elitan.backend.entity.Collection;
import com.elitan.backend.service.CollectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CollectionController {
    private final CollectionService collectionService;

    @GetMapping
    public ResponseEntity<List<Collection>> getAllCollections() {
        return ResponseEntity.ok(collectionService.getAllCollections());
    }
}
