package com.elitan.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:5173")
public class FileUploadController {

    private final String UPLOAD_DIR = "uploads/";

    @PostMapping
    public ResponseEntity<List<String>> uploadFiles(@RequestParam("files") MultipartFile[] files) {
        List<String> fileUrls = new ArrayList<>();

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;
                
                String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
                String extension = "";
                int i = originalFilename.lastIndexOf('.');
                if (i > 0) {
                    extension = originalFilename.substring(i);
                }
                
                String newFilename = UUID.randomUUID().toString() + extension;
                Path filePath = uploadPath.resolve(newFilename);

                if (extension.equalsIgnoreCase(".glb")) {
                    // Đối với file 3D .glb, copy trực tiếp không qua optimize
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                } else {
                    // Đối với ảnh, thử optimize bằng Thumbnailator
                    Path tempPath = uploadPath.resolve("temp_" + newFilename);
                    Files.copy(file.getInputStream(), tempPath, StandardCopyOption.REPLACE_EXISTING);
                    try {
                        net.coobird.thumbnailator.Thumbnails.of(tempPath.toFile())
                                .size(1200, 1800)
                                .outputQuality(0.85)
                                .toFile(filePath.toFile());
                        Files.deleteIfExists(tempPath);
                    } catch (Exception e) {
                        // Fallback nếu không phải định dạng ảnh Thumbnailator hiểu
                        Files.move(tempPath, filePath, StandardCopyOption.REPLACE_EXISTING);
                    }
                }
                
                fileUrls.add("/uploads/" + newFilename);
            }

            return ResponseEntity.ok(fileUrls);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
