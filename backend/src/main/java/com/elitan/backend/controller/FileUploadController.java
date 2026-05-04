package com.elitan.backend.controller;

import com.elitan.backend.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/upload")
@Slf4j
@RequiredArgsConstructor
public class FileUploadController {

    private final CloudinaryService cloudinaryService;

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

                boolean isRaw = extension.equals(".glb");
                
                // Gửi file lên Cloudinary
                String secureUrl = cloudinaryService.uploadFile(file, "elitan_uploads", isRaw);
                fileUrls.add(secureUrl);
            }

            return ResponseEntity.ok(fileUrls);
        } catch (IOException e) {
            log.error("File upload error: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
