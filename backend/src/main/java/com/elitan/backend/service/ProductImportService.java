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
import java.util.concurrent.CompletableFuture;
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
    /**
     * Tạo file Excel mẫu có sẵn các cột và Dropdown cho Category, Color, Material (Tiếng Việt).
     */
    public byte[] generateTemplate() throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            // --- SHEET 1: HƯỚNG DẪN SỬ DỤNG ---
            Sheet guideSheet = workbook.createSheet("HUONG_DAN");
            createGuideSheet(guideSheet, workbook);

            // --- SHEET 2: DANH SÁCH SẢN PHẨM ---
            Sheet sheet = workbook.createSheet("DANH_SACH_SAN_PHAM");

            // 1. Tạo Header Tiếng Việt
            Row headerRow = sheet.createRow(0);
            String[] columns = { 
                "Tên sản phẩm", "Danh mục", "Giá bán", "Tồn kho", 
                "Mô tả chi tiết", "Màu sắc", "Chất liệu", "Kích thước (DxRxC)",
                "Tên file ảnh chính", "Các file ảnh phụ (cách nhau bằng dấu phẩy)", "Tên file 3D (.glb)" 
            };

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 25 * 256);
            }

            // 2. Thêm Toàn bộ Sản phẩm hiện có (Export)
            List<Product> allProducts = productRepository.findAll();
            int rowIndex = 1;
            for (Product product : allProducts) {
                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(product.getName());
                row.createCell(1).setCellValue(product.getCategory());
                row.createCell(2).setCellValue(product.getPrice() != null ? product.getPrice().doubleValue() : 0);
                row.createCell(3).setCellValue(product.getStock() != null ? product.getStock() : 0);
                row.createCell(4).setCellValue(product.getDescription());
                row.createCell(5).setCellValue(product.getColor());
                row.createCell(6).setCellValue(product.getMaterial());
                row.createCell(7).setCellValue(product.getDimensions());
                
                // Chỉ lấy tên file từ URL để hiển thị cho gọn (ví dụ: sofa.jpg)
                row.createCell(8).setCellValue(extractFilename(product.getImageUrl())); 
                row.createCell(10).setCellValue(extractFilename(product.getGlbUrl()));
            }

            // Nếu không có sản phẩm nào, thêm 1 dòng mẫu để người dùng biết cách nhập
            if (allProducts.isEmpty()) {
                Row sampleRow = sheet.createRow(1);
                sampleRow.createCell(0).setCellValue("Sản phẩm mẫu (Ví dụ: Ghế Sofa)");
                sampleRow.createCell(1).setCellValue("Sofa");
                sampleRow.createCell(2).setCellValue(1000000);
                sampleRow.createCell(3).setCellValue(10);
                sampleRow.createCell(8).setCellValue("image.jpg");
            }

            // 3. Thêm Data Validation (Dropdowns)
            DataValidationHelper validationHelper = sheet.getDataValidationHelper();

            // Category (Collection)
            String[] categories = collectionRepository.findAll().stream()
                    .map(com.elitan.backend.entity.Collection::getName).toArray(String[]::new);
            if (categories.length > 0) {
                addDropdown(sheet, validationHelper, categories, 1); // Cột B
            }

            // Color
            String[] colors = colorRepository.findAll().stream().map(com.elitan.backend.entity.Color::getName)
                    .toArray(String[]::new);
            if (colors.length > 0) {
                addDropdown(sheet, validationHelper, colors, 5); // Cột F
            }

            // Material
            String[] materials = materialRepository.findAll().stream().map(com.elitan.backend.entity.Material::getName)
                    .toArray(String[]::new);
            if (materials.length > 0) {
                addDropdown(sheet, validationHelper, materials, 6); // Cột G
            }

            // Mở Sheet sản phẩm trước khi lưu
            workbook.setActiveSheet(1);

            // 4. Ghi ra stream
            workbook.write(out);
            return out.toByteArray();
        }
    }

    private void createGuideSheet(Sheet sheet, Workbook workbook) {
        String[] instructions = {
            "HƯỚNG DẪN SỬ DỤNG FILE IMPORT SẢN PHẨM",
            "",
            "1. Cột 'Tên sản phẩm': Bắt buộc nhập tên hiển thị của sản phẩm.",
            "2. Cột 'Danh mục': Chọn từ danh sách thả xuống (Dropdown).",
            "3. Cột 'Giá bán': Chỉ nhập số, không nhập ký tự tiền tệ (Ví dụ: 1500000).",
            "4. Cột 'Tồn kho': Số lượng hàng có sẵn trong kho.",
            "5. Cột 'Màu sắc' & 'Chất liệu': Chọn từ danh sách có sẵn để đảm bảo tính đồng nhất.",
            "6. Cột 'Tên file ảnh chính': Tên chính xác của file ảnh bạn sẽ upload kèm (Ví dụ: sofa.jpg).",
            "7. Cột 'Tên file 3D': Tên file định dạng .glb (Ví dụ: sofa_model.glb).",
            "",
            "LƯU Ý QUAN TRỌNG:",
            "- KHÔNG thay đổi thứ tự các cột trong Sheet 'DANH_SACH_SAN_PHAM'.",
            "- Khi thực hiện Import trên website, hãy chọn đồng thời FILE EXCEL NÀY và TẤT CẢ FILE ẢNH/3D đi kèm.",
            "- Hệ thống sẽ dựa vào 'Tên file' trong Excel để khớp nối với file ảnh bạn upload lên."
        };

        CellStyle titleStyle = workbook.createCellStyle();
        Font titleFont = workbook.createFont();
        titleFont.setBold(true);
        titleFont.setFontHeightInPoints((short) 14);
        titleStyle.setFont(titleFont);

        for (int i = 0; i < instructions.length; i++) {
            Row row = sheet.createRow(i);
            Cell cell = row.createCell(0);
            cell.setCellValue(instructions[i]);
            if (i == 0) cell.setCellStyle(titleStyle);
        }
        sheet.setColumnWidth(0, 100 * 256);
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
        if (history == null)
            return;

        String batchFolder = history.getErrorLog(); // Lấy folder đã lưu ở bước trước
        history.setStatus("PROCESSING");
        history.setErrorLog(null); // Reset log
        importHistoryRepository.save(history);

        Path batchPath = Paths.get(batchFolder);
        File excelFile = batchPath.resolve(excelFileName).toFile();

        // Map filename to its local path instead of reading bytes into memory
        // Map filename (Lowercase) to its local path for case-insensitive matching
        Map<String, Path> assetPathMap = new HashMap<>();
        File[] allFiles = batchPath.toFile().listFiles();
        if (allFiles != null) {
            for (File f : allFiles) {
                if (!f.getName().equals(excelFileName)) {
                    assetPathMap.put(f.getName().toLowerCase(), f.toPath());
                }
            }
        }

        int totalRows = 0;
        int successRows = 0;
        int failedRows = 0;
        StringBuilder errorLog = new StringBuilder();

        try (Workbook workbook = WorkbookFactory.create(excelFile)) {
            Sheet sheet = workbook.getSheetAt(0);
            if (sheet == null) {
                finalizeImport(history, "FAILED", 0, 0, 0, "Không tìm thấy sheet dữ liệu.");
                return;
            }
            int lastRow = sheet.getLastRowNum();
            int totalRowsCount = lastRow;

            List<Product> productsToSave = new ArrayList<>();

            for (int i = 1; i <= lastRow; i++) {
                Row row = sheet.getRow(i);
                if (row == null || row.getCell(0) == null) continue;

                String productName = safeTrim(row, 0);
                if (productName == null || productName.isEmpty()) continue;

                // Tìm sản phẩm cũ để cập nhật (Upsert - Case Insensitive)
                Product existingProduct = productRepository.findByNameIgnoreCase(productName.trim()).orElse(null);
                
                Product product = processRowWithAssets(row, i, assetPathMap, errorLog, existingProduct);
                if (product != null) {
                    productsToSave.add(product);
                } else {
                    failedRows++;
                }

                if (productsToSave.size() >= CHUNK_SIZE) {
                    productRepository.saveAll(productsToSave);
                    successRows += productsToSave.size();
                    productsToSave.clear();
                    updateProgress(history, totalRowsCount, successRows, failedRows, errorLog);
                }
            }

            if (!productsToSave.isEmpty()) {
                productRepository.saveAll(productsToSave);
                successRows += productsToSave.size();
            }

            finalizeImport(history, "COMPLETED", totalRowsCount, successRows, failedRows, errorLog.toString());
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

    private Product processRowWithAssets(Row row, int rowNumber, Map<String, Path> assetPathMap, StringBuilder errorLog, Product existingProduct) {
        try {
            Product product = (existingProduct != null) ? existingProduct : new Product();
            
            product.setName(safeTrim(row, 0));
            product.setCategory(safeTrim(row, 1));
            
            String priceStr = safeTrim(row, 2);
            if (priceStr != null && !priceStr.isEmpty()) {
                try {
                    product.setPrice(new java.math.BigDecimal(priceStr));
                } catch (Exception e) {
                    product.setPrice(java.math.BigDecimal.ZERO);
                }
            } else if (product.getPrice() == null) {
                product.setPrice(java.math.BigDecimal.ZERO);
            }
            
            String stockStr = safeTrim(row, 3);
            if (stockStr != null && !stockStr.isEmpty()) product.setStock(Integer.parseInt(stockStr.replace(".0", "")));
            
            product.setDescription(safeTrim(row, 4));
            product.setColor(safeTrim(row, 5));
            product.setMaterial(safeTrim(row, 6));
            product.setDimensions(safeTrim(row, 7));

            // Xử lý Ảnh chính (Nếu không có file mới, giữ URL cũ của existingProduct)
            String mainImageFilename = safeTrim(row, 8);
            String mainImageUrl = uploadAsset(mainImageFilename, assetPathMap, "products/main", false, 
                                             rowNumber, "Ảnh chính", errorLog, product.getImageUrl());
            product.setImageUrl(mainImageUrl);

            // Xử lý 3D Model (Nếu không có file mới, giữ URL cũ của existingProduct)
            String modelFilename = safeTrim(row, 10);
            String modelUrl = uploadAsset(modelFilename, assetPathMap, "products/models", true, 
                                         rowNumber, "File 3D", errorLog, product.getGlbUrl());
            product.setGlbUrl(modelUrl);

            return product;
        } catch (Exception e) {
            synchronized (errorLog) {
                errorLog.append("Dòng ").append(rowNumber).append(": Lỗi dữ liệu hoặc định dạng không hợp lệ.\n");
            }
            return null;
        }
    }

    private String uploadAsset(String filename, Map<String, Path> assetPathMap, String folder, boolean isRaw,
            int rowNumber, String assetType, StringBuilder errorLog, String existingUrl) {
        if (filename == null || filename.isEmpty()) return existingUrl;

        // Tìm kiếm không phân biệt chữ hoa thường
        String lowerFilename = filename.toLowerCase();
        Path filePath = assetPathMap.get(lowerFilename);
        
        // Nếu không thấy, thử tự động thêm các đuôi phổ biến (đề phòng người dùng quên nhập đuôi file)
        if (filePath == null) {
            String[] commonExts = isRaw ? new String[]{".glb"} : new String[]{".jpg", ".png", ".jpeg", ".webp"};
            for (String ext : commonExts) {
                Path p = assetPathMap.get(lowerFilename + ext);
                if (p != null) {
                    filePath = p;
                    break;
                }
            }
        }

        if (filePath == null || !Files.exists(filePath)) {
            // Nếu là URL hoàn chỉnh (đã có trên Cloudinary), giữ nguyên
            if (filename.startsWith("http")) {
                return filename;
            }
            
            // Nếu không có file upload kèm nhưng sản phẩm ĐÃ CÓ ảnh cũ -> Giữ nguyên ảnh cũ
            if (existingUrl != null && !existingUrl.isEmpty()) {
                return existingUrl;
            }
            
            // Chỉ báo lỗi nếu đây là sản phẩm mới hoàn toàn và không tìm thấy file
            synchronized (errorLog) {
                errorLog.append("Dòng ").append(rowNumber).append(": ").append(assetType).append(" '")
                        .append(filename)
                        .append("' không tìm thấy (đã thử tìm cả file có đuôi mở rộng).\n");
            }
            return null;
        }
        try {
            return cloudinaryService.uploadFile(filePath.toFile(), folder, isRaw);
        } catch (IOException e) {
            synchronized (errorLog) {
                errorLog.append("Row ").append(rowNumber).append(": Lỗi khi tải file ").append(filename)
                        .append(" lên Cloudinary.\n");
            }
            return null;
        }
    }

    private String extractFilename(String url) {
        if (url == null || url.isEmpty()) return "";
        if (!url.startsWith("http")) return url;
        try {
            int lastSlash = url.lastIndexOf("/");
            if (lastSlash != -1) {
                return url.substring(lastSlash + 1);
            }
        } catch (Exception e) {
            return url;
        }
        return url;
    }

    private String safeTrim(Row row, int index) {
        if (row == null) return null;
        Cell cell = row.getCell(index);
        String val = getCellValueAsString(cell);
        return (val != null) ? val.trim() : "";
    }

    // ===== ĐỌC FILE EXCEL (.xlsx) =====
    private List<String[]> readExcelFile(File file) throws IOException {
        List<String[]> rows = new ArrayList<>();
        try (FileInputStream fis = new FileInputStream(file);
                Workbook workbook = new XSSFWorkbook(fis)) {
            // Ưu tiên tìm sheet dữ liệu tiếng Việt, nếu không thấy thì lấy sheet đầu tiên
            Sheet sheet = workbook.getSheet("DANH_SACH_SAN_PHAM");
            if (sheet == null) {
                sheet = workbook.getSheetAt(0);
            }
            int lastColumn = 0;

            // Xác định số cột từ header row
            Row headerRow = sheet.getRow(0);
            if (headerRow != null) {
                lastColumn = headerRow.getLastCellNum();
            }

            // Bỏ qua dòng header (dòng 0), đọc từ dòng 1
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null)
                    continue;

                String[] values = new String[lastColumn];
                boolean hasData = false;
                for (int j = 0; j < lastColumn; j++) {
                    Cell cell = row.getCell(j, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
                    values[j] = getCellValueAsString(cell);
                    if (values[j] != null && !values[j].isEmpty())
                        hasData = true;
                }
                if (hasData)
                    rows.add(values);
            }
        }
        return rows;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null)
            return "";
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
                if (isHeader) {
                    isHeader = false;
                    continue;
                } // Bỏ qua header
                if (line.trim().isEmpty())
                    continue;
                rows.add(line.split(",", -1));
            }
        }
        return rows;
    }
}
