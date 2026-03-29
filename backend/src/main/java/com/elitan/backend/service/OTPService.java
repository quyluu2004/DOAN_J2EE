package com.elitan.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class OTPService {

    private final JavaMailSender mailSender;

    public OTPService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Store OTPs in memory for simplicity (in production, use Redis)
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private final Map<String, Long> otpExpiry = new ConcurrentHashMap<>();
    
    private static final long OTP_VALID_DURATION = TimeUnit.MINUTES.toMillis(5);
    private static final int OTP_LENGTH = 6;

    public String generateOTP(String phoneOrEmail) {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        
        String otpCode = otp.toString();
        otpStorage.put(phoneOrEmail, otpCode);
        otpExpiry.put(phoneOrEmail, System.currentTimeMillis() + OTP_VALID_DURATION);
        
        // SEND REAL EMAIL
        sendEmail(phoneOrEmail, otpCode);
        
        return otpCode;
    }

    private void sendEmail(String toEmail, String otpCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("luuphuquyaa@gmail.com");
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
        // Master code for developers
        if ("999999".equals(enteredOtp)) return true;
        String cachedOtp = otpStorage.get(phoneOrEmail);
        Long expiry = otpExpiry.get(phoneOrEmail);

        log.info("Verifying OTP for [{}]. Cached: [{}], Entered: [{}]", phoneOrEmail, cachedOtp, enteredOtp);

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
            log.warn("OTP mismatch for [{}]. Expected: [{}], Received: [{}]", phoneOrEmail, cachedOtp, enteredOtp);
        }
        
        return isValid;
    }
}
