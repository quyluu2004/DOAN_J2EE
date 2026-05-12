package com.elitan.backend.service;
import com.elitan.backend.entity.*;
import com.elitan.backend.repository.*;
import org.apache.poi.ss.util.CellRangeAddressList;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.math.BigDecimal;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ProductImportService {

    private final ProductRepository productRepository;
    private final ImportHistoryRepository importHistoryRepository;
    private final CollectionRepository collectionRepository;
    private final ColorRepository colorRepository;
    private final MaterialRepository materialRepository;
    private final CloudinaryService cloudinaryService;

    public ProductImportService(ProductRepository productRepository, 
                                ImportHistoryRepository importHistoryRepository,
                                CollectionRepository collectionRepository,
                                ColorRepository colorRepository,
                                MaterialRepository materialRepository,
                                CloudinaryService cloudinaryService) {
        this.productRepository = productRepository;
        this.importHistoryRepository = importHistoryRepository;
        this.collectionRepository = collectionRepository;
        this.colorRepository = colorRepository;
        this.materialRepository = materialRepository;
        this.cloudinaryService = cloudinaryService;
    }

    private static final int CHUNK_SIZE = 500;

    /**
     * Tạo file Excel mẫu có sẵn các cột và Dropdown cho Category, Color, Material.
     */
    public byte[] generateTemplate() throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Product Template");

            // 1. Tạo Header
            Row headerRow = sheet.createRow(0);
            String[] columns = {"Name", "Category", "Price", "Stock", "Description", "Color", "Material", "Dimensions", "Main Image Filename", "Additional Images (comma separated)", "3D Model Filename"};
            
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 20 * 256);
            }

            // 2. Thêm Data Validation (Dropdowns)
            DataValidationHelper validationHelper = sheet.getDataValidationHelper();

            // Category (Collection)
            String[] categories = collectionRepository.findAll().stream().map(com.elitan.backend.entity.Collection::getName).toArray(String[]::new);
            if (categories.length > 0) {
                addDropdown(sheet, validationHelper, categories, 1); // Cột B
            }

            // Color
            String[] colors = colorRepository.findAll().stream().map(com.elitan.backend.entity.Color::getName).toArray(String[]::new);
            if (colors.length > 0) {
                addDropdown(sheet, validationHelper, colors, 5); // Cột F
            }

            // Material
            String[] materials = materialRepository.findAll().stream().map(com.elitan.backend.entity.Material::getName).toArray(String[]::new);
            if (materials.length > 0) {
                addDropdown(sheet, validationHelper, materials, 6); // Cột G
            }

            // 3. Ghi ra stream
            workbook.write(out);
            return out.toByteArray();
        }
    }

    private void addDropdown(Sheet sheet, DataValidationHelper helper, String[] options, int colIndex) {
        CellRangeAddressList addressList = new CellRangeAddressList(1, 1000, colIndex, colIndex);
        DataValidationConstraint constraint = helper.createExplicitListConstraint(options);
        DataValidation validation = helper.createValidation(constraint, addressList);
        
        // Cấu hình hiển thị lỗi nếu nhập sai
        validation.setShowErrorBox(true);
        validation.setErrorStyle(DataValidation.ErrorStyle.STOP);
        validation.createErrorBox("Dữ liệu không hợp lệ", "Vui lòng chọn giá trị từ danh sách xổ xuống.");
        
        sheet.addValidationData(validation);
    }

    /**
     * Lưu danh sách file tạm (Excel + Assets) và tạo bản ghi ImportHistory.
     */
    public ImportHistory receiveFiles(List<MultipartFile> files, String excelFileName) throws IOException {
        // Tạo thư mục riêng cho lần import này dựa trên timestamp
        String batchFolder = "imports/" + System.currentTimeMillis();
        Path batchPath = Paths.get(batchFolder);
        Files.createDirectories(batchPath);

        for (MultipartFile file : files) {
            String fileName = file.getOriginalFilename();
            if (fileName != null) {
                Files.write(batchPath.resolve(fileName), file.getBytes());
            }
        }

        ImportHistory history = ImportHistory.builder()
                .fileName(excelFileName)
                .status("PENDING")
                .totalRows(0)
                .successRows(0)
                .failedRows(0)
                .createdAt(LocalDateTime.now())
                .errorLog(batchFolder) // Tạm lưu đường dẫn folder vào errorLog để process sau
                .build();
        
        return importHistoryRepository.save(history);
    }

    /**
     * Xử lý bất đồng bộ: Đọc file → Validate → Ghi chunk vào DB.
     * Tương đương cơ chế ItemReader → ItemProcessor → ItemWriter của Spring Batch.
     */
    @Async
    public void processImportAsync(Long historyId, String excelFileName) {
        ImportHistory history = importHistoryRepository.findById(historyId).orElse(null);
        if (history == null) return;

        String batchFolder = history.getErrorLog(); // Lấy folder đã lưu ở bước trước
        history.setStatus("PROCESSING");
        history.setErrorLog(null); // Reset log
        importHistoryRepository.save(history);

        Path batchPath = Paths.get(batchFolder);
        File excelFile = batchPath.resolve(excelFileName).toFile();
        
        // Load tất cả asset files vào Map để tìm kiếm nhanh
        Map<String, byte[]> assetMap = new HashMap<>();
        File[] allFiles = batchPath.toFile().listFiles();
        if (allFiles != null) {
            for (File f : allFiles) {
                if (!f.getName().equals(excelFileName)) {
                    try {
                        assetMap.put(f.getName(), Files.readAllBytes(f.toPath()));
                    } catch (IOException ignored) {}
                }
            }
        }

        int totalRows = 0;
        int successRows = 0;
        int failedRows = 0;
        StringBuilder errorLog = new StringBuilder();

        try {
            boolean isCsv = excelFileName.toLowerCase().endsWith(".csv");
            List<String[]> allRows = isCsv ? readCsvFile(excelFile) : readExcelFile(excelFile);

            if (allRows.isEmpty()) {
                finalizeImport(history, "FAILED", 0, 0, 0, "File has no data rows.");
                return;
            }

            totalRows = allRows.size();
            List<Product> chunk = new ArrayList<>();

            for (int i = 0; i < allRows.size(); i++) {
                String[] row = allRows.get(i);
                int rowNumber = i + 2;

                try {
                    Product product = processRowWithAssets(row, rowNumber, errorLog, assetMap);
                    if (product != null) {
                        chunk.add(product);
                    } else {
                        failedRows++;
                    }
                } catch (Exception e) {
                    failedRows++;
                    errorLog.append("Row ").append(rowNumber).append(": ").append(e.getMessage()).append("\n");
                }

                if (chunk.size() >= CHUNK_SIZE) {
                    productRepository.saveAll(chunk);
                    successRows += chunk.size();
                    chunk.clear();
                    updateProgress(history, totalRows, successRows, failedRows, errorLog);
                }
            }

            if (!chunk.isEmpty()) {
                productRepository.saveAll(chunk);
                successRows += chunk.size();
            }

            finalizeImport(history, "COMPLETED", totalRows, successRows, failedRows, errorLog.toString());
        } catch (Exception e) {
            log.error("Import failed for history ID: {}", historyId, e);
            finalizeImport(history, "FAILED", totalRows, successRows, failedRows, "CRITICAL: " + e.getMessage());
        } finally {
            deleteDirectory(batchPath.toFile());
        }
    }

    private void updateProgress(ImportHistory history, int total, int success, int failed, StringBuilder log) {
        history.setTotalRows(total);
        history.setSuccessRows(success);
        history.setFailedRows(failed);
        history.setErrorLog(log.length() > 0 ? log.toString() : null);
        importHistoryRepository.save(history);
    }

    private void finalizeImport(ImportHistory history, String status, int total, int success, int failed, String log) {
        history.setStatus(status);
        history.setTotalRows(total);
        history.setSuccessRows(success);
        history.setFailedRows(failed);
        history.setErrorLog(log != null && !log.isEmpty() ? log : null);
        history.setCompletedAt(LocalDateTime.now());
        importHistoryRepository.save(history);
    }

    private void deleteDirectory(File directoryToBeDeleted) {
        File[] allContents = directoryToBeDeleted.listFiles();
        if (allContents != null) {
            for (File file : allContents) {
                deleteDirectory(file);
            }
        }
        directoryToBeDeleted.delete();
    }

    private Product processRowWithAssets(String[] row, int rowNumber, StringBuilder errorLog, Map<String, byte[]> assetMap) {
        if (row.length < 3) {
            errorLog.append("Row ").append(rowNumber).append(": Not enough columns\n");
            return null;
        }

        String name = safeTrim(row, 0);
        String category = safeTrim(row, 1);
        String priceStr = safeTrim(row, 2);

        if (name == null || name.isEmpty()) {
            errorLog.append("Row ").append(rowNumber).append(": Name is empty\n");
            return null;
        }
        
        // Validate Category exists
        if (category != null && !category.isEmpty()) {
            boolean exists = collectionRepository.existsByName(category);
            if (!exists) {
                errorLog.append("Row ").append(rowNumber).append(": Category '").append(category).append("' does not exist. Please create it first.\n");
                return null;
            }
        }

        BigDecimal price;
        try {
            price = new BigDecimal(priceStr != null ? priceStr : "0");
        } catch (NumberFormatException e) {
            errorLog.append("Row ").append(rowNumber).append(": Invalid price '").append(priceStr).append("'\n");
            return null;
        }

        int stock = 10;
        String stockStr = safeTrim(row, 3);
        if (stockStr != null && !stockStr.isEmpty()) {
            try { stock = Integer.parseInt(stockStr.replace(".0", "")); } catch (NumberFormatException ignored) {}
        }

        // --- Asset Processing ---
        String mainImageFilename = safeTrim(row, 8);
        String additionalImagesStr = safeTrim(row, 9);
        String glbFilename = safeTrim(row, 10);

        String mainImageUrl = null;
        if (mainImageFilename != null && !mainImageFilename.isEmpty()) {
            mainImageUrl = uploadAsset(mainImageFilename, assetMap, "products/images", false, rowNumber, "Main Image", errorLog);
        }

        String glbUrl = null;
        if (glbFilename != null && !glbFilename.isEmpty()) {
            glbUrl = uploadAsset(glbFilename, assetMap, "products/3d", true, rowNumber, "3D Model", errorLog);
        }

        // Additional Images logic could be added here if Product entity supported a List<String>
        // For now, we'll focus on main image and GLB as per current entity structure.

        return Product.builder()
                .name(name)
                .category(category)
                .price(price)
                .stock(stock)
                .description(safeTrim(row, 4))
                .color(safeTrim(row, 5))
                .material(safeTrim(row, 6))
                .dimensions(safeTrim(row, 7))
                .imageUrl(mainImageUrl)
                .glbUrl(glbUrl)
                .build();
    }

    private String uploadAsset(String filename, Map<String, byte[]> assetMap, String folder, boolean isRaw, int rowNumber, String assetType, StringBuilder errorLog) {
        byte[] bytes = assetMap.get(filename);
        if (bytes == null) {
            errorLog.append("Row ").append(rowNumber).append(": ").append(assetType).append(" file '").append(filename).append("' not found in upload batch.\n");
            return null;
        }
        try {
            return cloudinaryService.uploadBytes(bytes, filename, folder, isRaw);
        } catch (IOException e) {
            errorLog.append("Row ").append(rowNumber).append(": Failed to upload ").append(filename).append(" to Cloudinary.\n");
            return null;
        }
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
