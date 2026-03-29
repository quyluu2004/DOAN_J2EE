package com.elitan.backend.exception;
// turbo
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            // Chỉ lấy lỗi đầu tiên của field đó để trả về cho FE
            if (!errors.containsKey("error")) {
                errors.put("error", error.getDefaultMessage());
            }
        });
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleAllExceptions(Exception ex) {
        ex.printStackTrace(); // Hiện lỗi trong console backend để debug
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getClass().getSimpleName());
        errorResponse.put("message", ex.getMessage() != null ? ex.getMessage() : "Internal Server Error");
        
        // Trả về 500 cho các lỗi hệ thống không mong muốn
        return ResponseEntity.status(500).body(errorResponse);
    }
}
