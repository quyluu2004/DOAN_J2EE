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
     * API để Frontend tải file Excel mẫu có sẵn dropdown validation.
     */
    @GetMapping("/import-template")
    public ResponseEntity<byte[]> downloadTemplate() {
        try {
            byte[] excelContent = productImportService.generateTemplate();
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=product_import_template.xlsx")
                    .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    .body(excelContent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * API nhận file Excel/CSV từ Frontend.
     * Trả lại HTTP 202 Accepted kèm import ID để FE theo dõi.
     */
    @PostMapping("/import-file")
    public ResponseEntity<?> importFile(@RequestParam("files") java.util.List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No files uploaded"));
        }

        // Tìm file Excel/CSV trong danh sách
        MultipartFile excelFile = files.stream()
                .filter(f -> {
                    String name = f.getOriginalFilename();
                    return name != null && (name.endsWith(".xlsx") || name.endsWith(".csv"));
                })
                .findFirst()
                .orElse(null);

        if (excelFile == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Excel/CSV file not found in the upload batch"));
        }

        try {
            // 1. Lưu tất cả file tạm + tạo bản ghi PENDING
            ImportHistory history = productImportService.receiveFiles(files, excelFile.getOriginalFilename());

            // 2. Kích hoạt luồng xử lý bất đồng bộ (@Async)
            productImportService.processImportAsync(history.getId(), excelFile.getOriginalFilename());

            // 3. Trả lại ngay cho Frontend: HTTP 202 Accepted
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(Map.of(
                    "message", "Files accepted. Import is being processed.",
                    "importId", history.getId(),
                    "status", "PENDING"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process files: " + e.getMessage()));
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
