package com.elitan.backend.controller;

import lombok.extern.slf4j.Slf4j;
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
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@Slf4j
public class FileUploadController {

    private final String UPLOAD_DIR = "uploads/";

    // Whitelist MIME types được phép upload
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/svg+xml",
            "model/gltf-binary"          // File .glb
    );

    // Whitelist extensions được phép
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".glb"
    );

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

                // Kiểm tra path traversal attack (ví dụ: ../../etc/passwd)
                if (originalFilename.contains("..")) {
                    log.warn("Path traversal attempt detected: {}", originalFilename);
                    continue;
                }

                // Lấy extension
                String extension = "";
                int i = originalFilename.lastIndexOf('.');
                if (i > 0) {
                    extension = originalFilename.substring(i).toLowerCase();
                }

                // Validate extension
                if (!ALLOWED_EXTENSIONS.contains(extension)) {
                    log.warn("Rejected file with disallowed extension: {}", extension);
                    continue;
                }

                // Validate MIME type
                String contentType = file.getContentType();
                if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
                    log.warn("Rejected file with disallowed MIME type: {}", contentType);
                    continue;
                }

                String newFilename = UUID.randomUUID().toString() + extension;
                Path filePath = uploadPath.resolve(newFilename);

                if (extension.equals(".glb")) {
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
            log.error("File upload error: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
