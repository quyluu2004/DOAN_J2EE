package com.elitan.backend.service;

import com.elitan.backend.entity.ImportHistory;
import com.elitan.backend.entity.Product;
import com.elitan.backend.repository.ImportHistoryRepository;
import com.elitan.backend.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.*;
import java.math.BigDecimal;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class ProductImportService {

    private final ProductRepository productRepository;
    private final ImportHistoryRepository importHistoryRepository;

    public ProductImportService(ProductRepository productRepository, ImportHistoryRepository importHistoryRepository) {
        this.productRepository = productRepository;
        this.importHistoryRepository = importHistoryRepository;
    }

    private static final int CHUNK_SIZE = 500;

    /**
     * Lưu file tạm và tạo bản ghi ImportHistory với trạng thái PENDING.
     * Trả về ImportHistory để controller gửi ID lại cho Frontend.
     */
    public ImportHistory receiveFile(String originalFileName, byte[] fileBytes) throws IOException {
        // Lưu file vào thư mục tạm
        Path tempDir = Paths.get("imports");
        Files.createDirectories(tempDir);
        String safeFileName = System.currentTimeMillis() + "_" + originalFileName;
        Path filePath = tempDir.resolve(safeFileName);
        Files.write(filePath, fileBytes);

        // Tạo bản ghi lịch sử import
        ImportHistory history = ImportHistory.builder()
                .fileName(originalFileName)
                .status("PENDING")
                .totalRows(0)
                .successRows(0)
                .failedRows(0)
                .createdAt(LocalDateTime.now())
                .build();
        history = importHistoryRepository.save(history);

        return history;
    }

    /**
     * Xử lý bất đồng bộ: Đọc file → Validate → Ghi chunk vào DB.
     * Tương đương cơ chế ItemReader → ItemProcessor → ItemWriter của Spring Batch.
     */
    @Async
    public void processImportAsync(Long historyId, String originalFileName) {
        ImportHistory history = importHistoryRepository.findById(historyId).orElse(null);
        if (history == null) return;

        history.setStatus("PROCESSING");
        importHistoryRepository.save(history);

        // Tìm file đã lưu tạm
        Path tempDir = Paths.get("imports");
        File[] matchedFiles = tempDir.toFile().listFiles((dir, name) -> name.endsWith("_" + originalFileName) || name.contains(originalFileName));
        
        if (matchedFiles == null || matchedFiles.length == 0) {
            history.setStatus("FAILED");
            history.setErrorLog("File not found on server after upload.");
            history.setCompletedAt(LocalDateTime.now());
            importHistoryRepository.save(history);
            return;
        }

        File importFile = matchedFiles[matchedFiles.length - 1]; // Lấy file mới nhất
        int totalRows = 0;
        int successRows = 0;
        int failedRows = 0;
        StringBuilder errorLog = new StringBuilder();

        try {
            // ===== ITEM READER: Đọc file Excel/CSV =====
            boolean isCsv = originalFileName.toLowerCase().endsWith(".csv");
            List<String[]> allRows;

            if (isCsv) {
                allRows = readCsvFile(importFile);
            } else {
                allRows = readExcelFile(importFile);
            }

            if (allRows.isEmpty()) {
                history.setStatus("FAILED");
                history.setErrorLog("File is empty or has no data rows.");
                history.setCompletedAt(LocalDateTime.now());
                importHistoryRepository.save(history);
                return;
            }

            totalRows = allRows.size();
            List<Product> chunk = new ArrayList<>();

            for (int i = 0; i < allRows.size(); i++) {
                String[] row = allRows.get(i);
                int rowNumber = i + 2; // +2 vì dòng 1 là header

                try {
                    // ===== ITEM PROCESSOR: Validate từng dòng =====
                    Product product = processRow(row, rowNumber, errorLog);
                    if (product != null) {
                        chunk.add(product);
                    } else {
                        failedRows++;
                    }
                } catch (Exception e) {
                    failedRows++;
                    errorLog.append("Row ").append(rowNumber).append(": ").append(e.getMessage()).append("\n");
                }

                // ===== ITEM WRITER: Gom đủ CHUNK_SIZE thì ghi 1 nhát xuống DB =====
                if (chunk.size() >= CHUNK_SIZE) {
                    productRepository.saveAll(chunk);
                    successRows += chunk.size();
                    chunk.clear();
                    log.info("Import progress: {} / {} rows processed", successRows + failedRows, totalRows);
                }
            }

            // Ghi nốt phần còn lại (< CHUNK_SIZE)
            if (!chunk.isEmpty()) {
                productRepository.saveAll(chunk);
                successRows += chunk.size();
            }

            history.setStatus("COMPLETED");
        } catch (Exception e) {
            log.error("Import failed for history ID: {}", historyId, e);
            history.setStatus("FAILED");
            errorLog.append("CRITICAL: ").append(e.getMessage());
        } finally {
            history.setTotalRows(totalRows);
            history.setSuccessRows(successRows);
            history.setFailedRows(failedRows);
            history.setErrorLog(errorLog.length() > 0 ? errorLog.toString() : null);
            history.setCompletedAt(LocalDateTime.now());
            importHistoryRepository.save(history);

            // Dọn file tạm
            try { Files.deleteIfExists(importFile.toPath()); } catch (IOException ignored) {}
            log.info("Import completed: {} success, {} failed out of {} rows", successRows, failedRows, totalRows);
        }
    }

    /**
     * ITEM PROCESSOR: Validate và chuyển đổi 1 dòng dữ liệu thành Product.
     * Cột yêu cầu: name, category, price, stock, description, color, material, dimensions, imageUrl
     */
    private Product processRow(String[] row, int rowNumber, StringBuilder errorLog) {
        // Cần tối thiểu 3 cột: name, category, price
        if (row.length < 3) {
            errorLog.append("Row ").append(rowNumber).append(": Not enough columns (need at least name, category, price)\n");
            return null;
        }

        String name = safeTrim(row, 0);
        String category = safeTrim(row, 1);
        String priceStr = safeTrim(row, 2);

        // Validate bắt buộc
        if (name == null || name.isEmpty()) {
            errorLog.append("Row ").append(rowNumber).append(": Name is empty\n");
            return null;
        }
        if (priceStr == null || priceStr.isEmpty()) {
            errorLog.append("Row ").append(rowNumber).append(": Price is empty\n");
            return null;
        }

        BigDecimal price;
        try {
            price = new BigDecimal(priceStr);
            if (price.compareTo(BigDecimal.ZERO) < 0) {
                errorLog.append("Row ").append(rowNumber).append(": Price is negative\n");
                return null;
            }
        } catch (NumberFormatException e) {
            errorLog.append("Row ").append(rowNumber).append(": Invalid price format '").append(priceStr).append("'\n");
            return null;
        }

        int stock = 10; // default
        String stockStr = safeTrim(row, 3);
        if (stockStr != null && !stockStr.isEmpty()) {
            try { stock = Integer.parseInt(stockStr.replace(".0", "")); } catch (NumberFormatException ignored) {}
        }

        return Product.builder()
                .name(name)
                .category(category)
                .price(price)
                .stock(stock)
                .description(safeTrim(row, 4))
                .color(safeTrim(row, 5))
                .material(safeTrim(row, 6))
                .dimensions(safeTrim(row, 7))
                .imageUrl(safeTrim(row, 8))
                .build();
    }

    private String safeTrim(String[] arr, int index) {
        if (index >= arr.length) return null;
        String val = arr[index];
        return (val != null) ? val.trim() : null;
    }

    // ===== ĐỌC FILE EXCEL (.xlsx) =====
    private List<String[]> readExcelFile(File file) throws IOException {
        List<String[]> rows = new ArrayList<>();
        try (FileInputStream fis = new FileInputStream(file);
             Workbook workbook = new XSSFWorkbook(fis)) {
            Sheet sheet = workbook.getSheetAt(0);
            int lastColumn = 0;

            // Xác định số cột từ header row
            Row headerRow = sheet.getRow(0);
            if (headerRow != null) {
                lastColumn = headerRow.getLastCellNum();
            }

            // Bỏ qua dòng header (dòng 0), đọc từ dòng 1
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                String[] values = new String[lastColumn];
                boolean hasData = false;
                for (int j = 0; j < lastColumn; j++) {
                    Cell cell = row.getCell(j, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
                    values[j] = getCellValueAsString(cell);
                    if (values[j] != null && !values[j].isEmpty()) hasData = true;
                }
                if (hasData) rows.add(values);
            }
        }
        return rows;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        String type = cell.getCellType().name();
        switch (type) {
            case "STRING":
                return cell.getStringCellValue();
            case "NUMERIC":
                double val = cell.getNumericCellValue();
                if (val == Math.floor(val) && !Double.isInfinite(val)) {
                    return String.valueOf((long) val);
                }
                return String.valueOf(val);
            case "BOOLEAN":
                return String.valueOf(cell.getBooleanCellValue());
            case "FORMULA":
                return cell.getStringCellValue();
            default:
                return "";
        }
    }

    // ===== ĐỌC FILE CSV =====
    private List<String[]> readCsvFile(File file) throws IOException {
        List<String[]> rows = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            boolean isHeader = true;
            while ((line = reader.readLine()) != null) {
                if (isHeader) { isHeader = false; continue; } // Bỏ qua header
                if (line.trim().isEmpty()) continue;
                rows.add(line.split(",", -1));
            }
        }
        return rows;
    }
}
