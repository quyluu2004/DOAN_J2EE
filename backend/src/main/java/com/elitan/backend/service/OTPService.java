package com.elitan.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.security.SecureRandom;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class OTPService {

    private final JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String fromEmail;

    public OTPService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Store OTPs in memory for simplicity (in production, use Redis)
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private final Map<String, Long> otpExpiry = new ConcurrentHashMap<>();
    
    private static final long OTP_VALID_DURATION = TimeUnit.MINUTES.toMillis(5);
    private static final int OTP_LENGTH = 6;

    private static final SecureRandom secureRandom = new SecureRandom();

    public String generateOTP(String phoneOrEmail) {
        String otpCode = String.format("%06d", secureRandom.nextInt(1000000));
        otpStorage.put(phoneOrEmail, otpCode);
        otpExpiry.put(phoneOrEmail, System.currentTimeMillis() + OTP_VALID_DURATION);
        
        // SEND REAL EMAIL
        sendEmail(phoneOrEmail, otpCode);
        
        return otpCode;
    }

    private void sendEmail(String toEmail, String otpCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("[ÉLITAN] Mã xác nhận đặt hàng của bạn");
            message.setText("Chào bạn,\n\n" +
                            "Mã xác nhận (OTP) để hoàn tất đơn hàng tại ÉLITAN là: " + otpCode + "\n" +
                            "Mã này có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.\n\n" +
                            "Cảm ơn bạn đã lựa chọn ÉLITAN!\n" +
                            "Trân trọng,\n" +
                            "Đội ngũ ÉLITAN");
            
            mailSender.send(message);
            log.info("Successfully sent OTP email to: {}", toEmail);
        } catch (Exception e) {
            log.error("CANNOT SEND EMAIL. Possible reasons: Wrong Password, Network, or Port Blocked.", e);
            // We don't throw here to avoid a 500 error in a demo, 
            // but in production we should handle this.
        }
    }

    public boolean verifyOTP(String phoneOrEmail, String enteredOtp) {
        // Master OTP bypass đã bị xóa vì lý do bảo mật
        String cachedOtp = otpStorage.get(phoneOrEmail);
        Long expiry = otpExpiry.get(phoneOrEmail);

        log.info("Verifying OTP for [{}]", phoneOrEmail);

        if (cachedOtp == null || expiry == null) {
            log.warn("OTP not found in storage for [{}]", phoneOrEmail);
            return false;
        }

        if (System.currentTimeMillis() > expiry) {
            log.warn("OTP expired for [{}]", phoneOrEmail);
            otpStorage.remove(phoneOrEmail);
            otpExpiry.remove(phoneOrEmail);
            return false;
        }

        boolean isValid = cachedOtp.equals(enteredOtp);
        if (isValid) {
            log.info("OTP verification successful for [{}]", phoneOrEmail);
            otpStorage.remove(phoneOrEmail);
            otpExpiry.remove(phoneOrEmail);
        } else {
            log.warn("OTP mismatch for [{}]", phoneOrEmail);
        }
        
        return isValid;
    }
}
