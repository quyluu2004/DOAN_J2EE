package com.elitan.backend.service;

import com.elitan.backend.entity.Product;
import com.elitan.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class Excel3DImportService {

    private final ProductRepository productRepository;

    public Map<String, Object> import3DModels(MultipartFile file) {
        int successRows = 0;
        int failedRows = 0;
        List<String> errorLogs = new ArrayList<>();
        int totalRows = 0;

        try (InputStream is = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            totalRows = sheet.getLastRowNum();

            // Bỏ qua dòng tiêu đề (dòng 0), bắt đầu đọc từ dòng 1
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                try {
                    // Cột A (0): Product ID
                    Cell idCell = row.getCell(0);
                    if (idCell == null) {
                        failedRows++;
                        errorLogs.add("Dòng " + (i + 1) + ": Thiếu Product ID");
                        continue;
                    }
                    
                    Long productId;
                    if (idCell.getCellType() == CellType.NUMERIC) {
                        productId = (long) idCell.getNumericCellValue();
                    } else if (idCell.getCellType() == CellType.STRING) {
                        productId = Long.parseLong(idCell.getStringCellValue().trim());
                    } else {
                        failedRows++;
                        errorLogs.add("Dòng " + (i + 1) + ": Sai định dạng Product ID");
                        continue;
                    }

                    // Cột B (1): Link mô hình 3D (.glb)
                    Cell urlCell = row.getCell(1);
                    if (urlCell == null) {
                        failedRows++;
                        errorLogs.add("Dòng " + (i + 1) + ": Thiếu đường dẫn Link GLB");
                        continue;
                    }
                    
                    String glbUrl = urlCell.getStringCellValue().trim();
                    if (glbUrl.isEmpty()) {
                        failedRows++;
                        errorLogs.add("Dòng " + (i + 1) + ": Link GLB trống");
                        continue;
                    }

                    // Cột C (2): Tên mô hình 3D (Optional)
                    Cell nameCell = row.getCell(2);
                    String glbName = null;
                    if (nameCell != null) {
                        try {
                            if (nameCell.getCellType() == CellType.STRING) {
                                glbName = nameCell.getStringCellValue().trim();
                            } else if (nameCell.getCellType() == CellType.NUMERIC) {
                                glbName = String.valueOf((long) nameCell.getNumericCellValue());
                            }
                        } catch (Exception ignored) {}
                    }

                    // Cột D (3): Link Hình Ảnh URL (Optional)
                    Cell imageCell = row.getCell(3);
                    String imageUrl = null;
                    if (imageCell != null && imageCell.getCellType() == CellType.STRING) {
                        imageUrl = imageCell.getStringCellValue().trim();
                    }

                    // Tìm Sản phẩm theo ID dưới Database
                    Product product = productRepository.findById(productId).orElse(null);
                    
                    if (product == null) {
                        // Nếu không thấy ID, kiểm tra xem Link 3D này đã có trong kho chưa (tránh trùng)
                        Product duplicate = productRepository.findByGlbUrl(glbUrl).orElse(null);
                        if (duplicate != null) {
                            // Nếu link 3D đã tồn tại ở một ID khác rồi thì bỏ qua dòng này
                            continue;
                        }

                        // Không thấy cả ID lẫn Link -> TẠO MỚI
                        product = new Product();
                        product.setPrice(new java.math.BigDecimal("0"));
                        product.setCategory("3D Assets");
                        product.setDescription("Sản phẩm được tạo từ Import Excel");
                    }

                    // Dù là hàng cũ (vừa tìm thấy ID) hay hàng mới (vừa tạo), 
                    // chúng ta đều cập nhật thông tin từ Excel vào:
                    product.setGlbUrl(glbUrl);
                    if (glbName != null && !glbName.isEmpty()) {
                        product.setGlbName(glbName);
                        // Cập nhật luôn tên sản phẩm cho đồng nhất
                        product.setName(glbName);
                    }
                    if (imageUrl != null && !imageUrl.isEmpty()) {
                        product.setImageUrl(imageUrl);
                    }

                    productRepository.save(product);
                    successRows++;

                } catch (Exception e) {
                    failedRows++;
                    errorLogs.add("Dòng " + (i + 1) + ": Lỗi xử lý - " + e.getMessage());
                }
            }

        } catch (Exception e) {
            log.error("Lỗi đọc file Excel", e);
            errorLogs.add("Không thể đọc File: " + e.getMessage());
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalRows", totalRows);
        result.put("successRows", successRows);
        result.put("failedRows", failedRows);
        result.put("errors", errorLogs);
        return result;
    }
}
