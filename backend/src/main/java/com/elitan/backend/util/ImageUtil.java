package com.elitan.backend.util;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;

@Component
public class ImageUtil {

    /**
     * Resizes and compresses an image file.
     * @param sourcePath Path to the original file
     * @param targetPath Path to save the optimized file
     * @param maxWidth Maximum width of the image
     * @param quality Quality from 0.0 to 1.0
     */
    public void optimizeImage(Path sourcePath, Path targetPath, int maxWidth, float quality) throws IOException {
        File sourceFile = sourcePath.toFile();
        File targetFile = targetPath.toFile();

        Thumbnails.of(sourceFile)
                .size(maxWidth, (int)(maxWidth * 1.5)) // Height will be proportional up to 1.5x width
                .outputQuality(quality)
                .toFile(targetFile);
    }
}
