package com.elitan.backend.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Hàm tạo mã OTP 6 số
    public String generateOTP() {
        java.util.Random random = new java.util.Random();
        int otp = 100000 + random.nextInt(900000); 
        return String.valueOf(otp);
    }

    // Hàm gửi email chứa mã OTP
    public void sendOtpEmail(String toEmail, String otpCode) {
        try {
            org.springframework.mail.SimpleMailMessage message = new org.springframework.mail.SimpleMailMessage();
            message.setFrom(fromEmail); // Lấy từ application.properties
            message.setTo(toEmail);
            message.setSubject("Mã xác thực — ÉLITAN");
            message.setText("Chào bạn,\n\nMã OTP xác nhận của bạn là: " + otpCode 
                          + "\n\nMã này có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.");

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi gửi email: " + e.getMessage());
        }
    }

    // Gửi email reset password với HTML template đẹp
    public void sendPasswordResetEmail(String to, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("ÉLITAN — Đặt lại mật khẩu");

            String htmlContent = buildResetEmailHtml(resetLink);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Không thể gửi email: " + e.getMessage());
        }
    }

    // Template HTML cho email reset password
    private String buildResetEmailHtml(String resetLink) {
        return """
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #111827; color: #ffffff; padding: 40px;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <h1 style="font-size: 28px; font-weight: bold; letter-spacing: 8px; color: #ffffff; margin: 0;">ÉLITAN</h1>
                        <p style="color: #9CA3AF; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-top: 8px;">Luxury Furniture</p>
                    </div>

                    <div style="background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 32px; margin-bottom: 32px;">
                        <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #ffffff;">Đặt lại mật khẩu</h2>
                        <p style="color: #D1D5DB; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                            Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản ÉLITAN của bạn.
                            Nhấn nút bên dưới để tạo mật khẩu mới. Link này sẽ hết hạn sau <strong>30 phút</strong>.
                        </p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="%s"
                               style="display: inline-block; background-color: #ffffff; color: #111827; padding: 14px 40px; text-decoration: none; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; border-radius: 0;">
                                ĐẶT LẠI MẬT KHẨU
                            </a>
                        </div>
                        <p style="color: #6B7280; font-size: 12px; line-height: 1.6;">
                            Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này. Mật khẩu của bạn sẽ không bị thay đổi.
                        </p>
                    </div>

                    <div style="text-align: center; color: #4B5563; font-size: 11px; letter-spacing: 1px;">
                        <p>© 2026 ÉLITAN. All rights reserved.</p>
                    </div>
                </div>
                """
                .formatted(resetLink);
    }
    // Gửi email xác nhận kèm Invoice PDF
    public void sendOrderConfirmation(String to, String orderId, byte[] invoicePdf) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("ÉLITAN — Order Confirmation " + orderId);

            String htmlContent = """
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111827; padding: 20px;">
                    <h1 style="font-size: 24px; color: #703225;">Thank you for your order.</h1>
                    <p style="font-size: 14px; line-height: 1.6;">Your order <strong>%s</strong> has been successfully placed.</p>
                    <p style="font-size: 14px; line-height: 1.6;">A detailed electronic invoice is attached as a PDF to this email for your records.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    <p style="font-size: 12px; color: #6B7280;">Warm regards,<br><strong>ÉLITAN Concierge Team</strong></p>
                </div>
                """.formatted(orderId);
                
            helper.setText(htmlContent, true);
            
            // Attach PDF
            helper.addAttachment("Elitan_Invoice_" + orderId + ".pdf", new org.springframework.core.io.ByteArrayResource(invoicePdf));

            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Failed to send order email: " + e.getMessage());
        }
    }
}
