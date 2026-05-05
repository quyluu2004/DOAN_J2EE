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

    /**
     * Generate signed upload parameters for direct frontend-to-Cloudinary upload.
     * This bypasses the backend for file transfer, making uploads much faster.
     */
    public Map<String, Object> generateSignedParams(String folder, String resourceType) {
        long timestamp = System.currentTimeMillis() / 1000L;
        String publicId = UUID.randomUUID().toString();
        
        Map<String, Object> paramsToSign = new java.util.TreeMap<>();
        paramsToSign.put("timestamp", timestamp);
        paramsToSign.put("folder", folder);
        paramsToSign.put("public_id", publicId);
        
        String signature = cloudinary.apiSignRequest(paramsToSign, cloudinary.config.apiSecret);
        
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("timestamp", timestamp);
        result.put("signature", signature);
        result.put("api_key", cloudinary.config.apiKey);
        result.put("cloud_name", cloudinary.config.cloudName);
        result.put("folder", folder);
        result.put("public_id", publicId);
        result.put("resource_type", resourceType != null ? resourceType : "auto");
        return result;
    }
}
