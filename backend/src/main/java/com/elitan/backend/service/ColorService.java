package com.elitan.backend.service;

import com.elitan.backend.entity.Color;
import com.elitan.backend.repository.ColorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ColorService {
    private final ColorRepository colorRepository;

    public List<Color> getAllColors() {
        return colorRepository.findAll();
    }

    public Color createColor(Color color) {
        return colorRepository.save(color);
    }

    public Color updateColor(Long id, Color colorDetails) {
        Color color = colorRepository.findById(id).orElseThrow();
        color.setName(colorDetails.getName());
        color.setHexCode(colorDetails.getHexCode());
        return colorRepository.save(color);
    }

    public void deleteColor(Long id) {
        colorRepository.deleteById(id);
    }
}
