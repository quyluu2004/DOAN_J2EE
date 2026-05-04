package com.elitan.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file, String folderName, boolean isRaw) throws IOException {
        try {
            // Xác định resource type (image, video, raw cho các file như .glb)
            String resourceType = isRaw ? "raw" : "auto";
            
            // Generate public_id (tên file trên Cloudinary) không chứa phần mở rộng
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.lastIndexOf(".") > 0) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            
            String publicId = UUID.randomUUID().toString();
            if (isRaw) {
                // Với resource_type: "raw", cần kèm theo extension trong public_id nếu muốn Cloudinary trả về đúng chuẩn
                publicId = publicId + extension;
            }

            Map<String, Object> uploadParams = ObjectUtils.asMap(
                    "folder", folderName,
                    "public_id", publicId,
                    "resource_type", resourceType
            );

            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            return uploadResult.get("secure_url").toString();
            
        } catch (IOException e) {
            log.error("Failed to upload file to Cloudinary", e);
            throw new IOException("Failed to upload file to Cloudinary: " + e.getMessage());
        }
    }
}
