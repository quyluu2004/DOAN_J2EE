package com.elitan.backend.service;

import com.elitan.backend.entity.Collection;
import com.elitan.backend.repository.CollectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CollectionService {
    private final CollectionRepository collectionRepository;

    public List<Collection> getAllCollections() {
        return collectionRepository.findAll();
    }

    public Collection createCollection(Collection collection) {
        return collectionRepository.save(collection);
    }

    public Collection updateCollection(Long id, Collection collectionDetails) {
        Collection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collection not found"));
        collection.setName(collectionDetails.getName());
        collection.setImageUrl(collectionDetails.getImageUrl());
        collection.setType(collectionDetails.getType());
        return collectionRepository.save(collection);
    }

    public void deleteCollection(Long id) {
        collectionRepository.deleteById(id);
    }
}
