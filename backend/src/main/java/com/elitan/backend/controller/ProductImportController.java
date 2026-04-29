package com.elitan.backend.controller;

import com.elitan.backend.entity.ImportHistory;
import com.elitan.backend.repository.ImportHistoryRepository;
import com.elitan.backend.service.ProductImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductImportController {

    private final ProductImportService productImportService;
    private final ImportHistoryRepository importHistoryRepository;

    /**
     * API nhận file Excel/CSV từ Frontend.
     * Trả lại HTTP 202 Accepted kèm import ID để FE theo dõi.
     */
    @PostMapping("/import-file")
    public ResponseEntity<?> importFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null || (!originalName.endsWith(".xlsx") && !originalName.endsWith(".csv"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only .xlsx and .csv files are supported"));
        }

        try {
            // 1. Lưu file tạm + tạo bản ghi PENDING
            byte[] fileBytes = file.getBytes();
            ImportHistory history = productImportService.receiveFile(originalName, fileBytes);

            // 2. Kích hoạt luồng xử lý bất đồng bộ (@Async)
            productImportService.processImportAsync(history.getId(), originalName);

            // 3. Trả lại ngay cho Frontend: HTTP 202 Accepted
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(Map.of(
                    "message", "File accepted. Import is being processed.",
                    "importId", history.getId(),
                    "status", "PENDING"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process file: " + e.getMessage()));
        }
    }

    /**
     * API để FE polling kiểm tra tiến trình import.
     */
    @GetMapping("/import-status/{id}")
    public ResponseEntity<?> getImportStatus(@PathVariable Long id) {
        return importHistoryRepository.findById(id)
                .map(history -> ResponseEntity.ok(Map.of(
                        "id", history.getId(),
                        "fileName", history.getFileName(),
                        "status", history.getStatus(),
                        "totalRows", history.getTotalRows(),
                        "successRows", history.getSuccessRows(),
                        "failedRows", history.getFailedRows(),
                        "errorLog", history.getErrorLog() != null ? history.getErrorLog() : ""
                )))
                .orElse(ResponseEntity.notFound().build());
    }
}
