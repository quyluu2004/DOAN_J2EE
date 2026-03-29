package com.elitan.backend.service;

import com.elitan.backend.entity.Material;
import com.elitan.backend.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialService {
    private final MaterialRepository materialRepository;

    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }

    public Material createMaterial(Material material) {
        return materialRepository.save(material);
    }

    public Material updateMaterial(Long id, Material materialDetails) {
        Material material = materialRepository.findById(id).orElseThrow();
        material.setName(materialDetails.getName());
        return materialRepository.save(material);
    }

    public void deleteMaterial(Long id) {
        materialRepository.deleteById(id);
    }
}
