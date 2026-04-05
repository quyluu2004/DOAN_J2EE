package com.elitan.backend.service;

import com.elitan.backend.dto.MomoPaymentRequest;
import com.elitan.backend.dto.MomoPaymentResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * Service xử lý thanh toán qua MoMo Sandbox (Test).
 * Sử dụng credentials test từ MoMo: partnerCode=MOMO.
 * Không thay đổi bất kỳ service nào hiện có.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MomoService {

    private final RestTemplate restTemplate;

    // ===== MOMO SANDBOX CREDENTIALS (Test only) =====
    @Value("${momo.endpoint:https://test-payment.momo.vn/v2/gateway/api/create}")
    private String momoEndpoint;

    @Value("${momo.partnerCode:MOMO}")
    private String partnerCode;

    @Value("${momo.accessKey:F8BBA842ECF85}")
    private String accessKey;

    @Value("${momo.secretKey:K951B6PE1waDMi640xX08PD3vg6EkVlz}")
    private String secretKey;

    @Value("${momo.redirectUrl:http://localhost:5173/payment/momo-return}")
    private String redirectUrl;

    @Value("${momo.ipnUrl:https://callback.url/notify}")
    private String ipnUrl;

    // ===== Tạo yêu cầu thanh toán MoMo =====
    public MomoPaymentResponse createPayment(MomoPaymentRequest paymentRequest) {
        try {
            // 1. Tạo requestId và orderId cho MoMo
            String requestId = partnerCode + System.currentTimeMillis();
            String momoOrderId = paymentRequest.getOrderId() + "_" + System.currentTimeMillis();

            String amount = String.valueOf(paymentRequest.getAmount());
            String orderInfo = paymentRequest.getOrderInfo() != null
                    ? paymentRequest.getOrderInfo()
                    : "Thanh toán đơn hàng #" + paymentRequest.getOrderId();
            String requestType = "payWithMethod";
            String extraData = "";

            // 2. Tạo rawSignature đúng thứ tự ABC theo tài liệu MoMo
            String rawSignature = "accessKey=" + accessKey
                    + "&amount=" + amount
                    + "&extraData=" + extraData
                    + "&ipnUrl=" + ipnUrl
                    + "&orderId=" + momoOrderId
                    + "&orderInfo=" + orderInfo
                    + "&partnerCode=" + partnerCode
                    + "&redirectUrl=" + redirectUrl
                    + "&requestId=" + requestId
                    + "&requestType=" + requestType;

            log.info("MoMo rawSignature: {}", rawSignature);

            // 3. Ký HMAC-SHA256
            String signature = signHmacSHA256(rawSignature, secretKey);
            log.info("MoMo signature: {}", signature);

            // 4. Build JSON body gửi sang MoMo
            Map<String, Object> body = new HashMap<>();
            body.put("partnerCode", partnerCode);
            body.put("accessKey", accessKey);
            body.put("requestId", requestId);
            body.put("amount", amount);
            body.put("orderId", momoOrderId);
            body.put("orderInfo", orderInfo);
            body.put("redirectUrl", redirectUrl);
            body.put("ipnUrl", ipnUrl);
            body.put("extraData", extraData);
            body.put("requestType", requestType);
            body.put("signature", signature);
            body.put("lang", "vi");

            // 5. Gọi API MoMo
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            @SuppressWarnings("unchecked")
            Map<String, Object> momoResponse = restTemplate.postForObject(momoEndpoint, entity, Map.class);

            if (momoResponse == null) {
                return MomoPaymentResponse.builder()
                        .success(false)
                        .message("Không nhận được phản hồi từ MoMo")
                        .build();
            }

            Integer resultCode = momoResponse.get("resultCode") != null
                    ? (Integer) momoResponse.get("resultCode") : null;
            String payUrl = (String) momoResponse.get("payUrl");
            String momoMessage = (String) momoResponse.get("message");

            log.info("MoMo response - resultCode: {}, message: {}", resultCode, momoMessage);

            if (resultCode != null && resultCode == 0) {
                return MomoPaymentResponse.builder()
                        .success(true)
                        .payUrl(payUrl)
                        .orderId(momoOrderId)
                        .resultCode(resultCode)
                        .message("Tạo link thanh toán MoMo thành công")
                        .build();
            } else {
                return MomoPaymentResponse.builder()
                        .success(false)
                        .resultCode(resultCode)
                        .message("MoMo từ chối: " + momoMessage)
                        .build();
            }

        } catch (Exception e) {
            log.error("Lỗi khi gọi MoMo API: ", e);
            return MomoPaymentResponse.builder()
                    .success(false)
                    .message("Lỗi hệ thống: " + e.getMessage())
                    .build();
        }
    }

    // ===== Xử lý IPN (Webhook) từ MoMo gọi về =====
    public void handleIpnCallback(Map<String, Object> ipnData) {
        try {
            Integer resultCode = (Integer) ipnData.get("resultCode");
            String momoOrderId = (String) ipnData.get("orderId");
            String receivedSignature = (String) ipnData.get("signature");

            // 1. Verify signature từ MoMo để chống giả mạo
            String rawSignature = buildIpnRawSignature(ipnData);
            String expectedSignature = signHmacSHA256(rawSignature, secretKey);

            if (!expectedSignature.equals(receivedSignature)) {
                log.warn("MoMo IPN: Chữ ký không hợp lệ! Có thể bị giả mạo. orderId={}", momoOrderId);
                return;
            }

            log.info("MoMo IPN nhận được - orderId: {}, resultCode: {}", momoOrderId, resultCode);

            // 2. Nếu thanh toán thành công (resultCode == 0), cập nhật trạng thái đơn hàng
            // momoOrderId có dạng "MOMO<timestamp>" - đây là orderId nội bộ của chúng ta
            // Bạn cần lưu mapping này lại nếu cần. Hiện tại demo chỉ log.
            if (resultCode != null && resultCode == 0) {
                log.info("✅ Thanh toán MoMo thành công cho orderId MoMo: {}", momoOrderId);
                // TODO: Cập nhật đơn hàng trong DB nếu bạn lưu momoOrderId vào Order entity
                // Order order = orderRepository.findByMomoOrderId(momoOrderId)...
                // order.setPaymentStatus("PAID");
            } else {
                log.info("❌ Thanh toán MoMo thất bại. resultCode: {}", resultCode);
            }

        } catch (Exception e) {
            log.error("Lỗi xử lý MoMo IPN callback: ", e);
        }
    }

    // ===== Helper: Tạo HMAC-SHA256 Signature =====
    private String signHmacSHA256(String data, String key) throws Exception {
        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256Hmac.init(secretKeySpec);
        byte[] hash = sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));

        // Chuyển sang hex string (tương đương .digest('hex') trong NodeJS)
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }

    // ===== Helper: Build rawSignature để verify IPN =====
    private String buildIpnRawSignature(Map<String, Object> ipnData) {
        return "accessKey=" + accessKey
                + "&amount=" + ipnData.get("amount")
                + "&extraData=" + ipnData.getOrDefault("extraData", "")
                + "&message=" + ipnData.get("message")
                + "&orderId=" + ipnData.get("orderId")
                + "&orderInfo=" + ipnData.get("orderInfo")
                + "&orderType=" + ipnData.get("orderType")
                + "&partnerCode=" + ipnData.get("partnerCode")
                + "&payType=" + ipnData.get("payType")
                + "&requestId=" + ipnData.get("requestId")
                + "&responseTime=" + ipnData.get("responseTime")
                + "&resultCode=" + ipnData.get("resultCode")
                + "&transId=" + ipnData.get("transId");
    }

    // ===== Tạo payment MoMo cho nạp ví =====
    public MomoPaymentResponse createWalletTopUpPayment(String userEmail, long amountVND) {
        try {
            String requestId = partnerCode + System.currentTimeMillis();
            String momoOrderId = "TOPUP_" + System.currentTimeMillis();
            String amount = String.valueOf(amountVND);
            String orderInfo = "Nạp ví Élitan - " + amountVND + " VND";
            String requestType = "payWithMethod";
            String extraData = "WALLET_TOPUP:" + userEmail;

            // redirectUrl cho wallet top-up trỏ về trang khác
            String walletRedirectUrl = redirectUrl.replace("/payment/momo-return", "/wallet/topup-return");

            String rawSignature = "accessKey=" + accessKey
                    + "&amount=" + amount
                    + "&extraData=" + extraData
                    + "&ipnUrl=" + ipnUrl
                    + "&orderId=" + momoOrderId
                    + "&orderInfo=" + orderInfo
                    + "&partnerCode=" + partnerCode
                    + "&redirectUrl=" + walletRedirectUrl
                    + "&requestId=" + requestId
                    + "&requestType=" + requestType;

            String signature = signHmacSHA256(rawSignature, secretKey);

            Map<String, Object> body = new HashMap<>();
            body.put("partnerCode", partnerCode);
            body.put("accessKey", accessKey);
            body.put("requestId", requestId);
            body.put("amount", amount);
            body.put("orderId", momoOrderId);
            body.put("orderInfo", orderInfo);
            body.put("redirectUrl", walletRedirectUrl);
            body.put("ipnUrl", ipnUrl);
            body.put("extraData", extraData);
            body.put("requestType", requestType);
            body.put("signature", signature);
            body.put("lang", "vi");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            @SuppressWarnings("unchecked")
            Map<String, Object> momoResponse = restTemplate.postForObject(momoEndpoint, entity, Map.class);

            if (momoResponse == null) {
                return MomoPaymentResponse.builder()
                        .success(false)
                        .message("Không nhận được phản hồi từ MoMo")
                        .build();
            }

            Integer resultCode = momoResponse.get("resultCode") != null
                    ? (Integer) momoResponse.get("resultCode") : null;
            String payUrl = (String) momoResponse.get("payUrl");

            if (resultCode != null && resultCode == 0) {
                return MomoPaymentResponse.builder()
                        .success(true)
                        .payUrl(payUrl)
                        .orderId(momoOrderId)
                        .resultCode(resultCode)
                        .message("Tạo link nạp ví MoMo thành công")
                        .build();
            } else {
                return MomoPaymentResponse.builder()
                        .success(false)
                        .resultCode(resultCode)
                        .message("MoMo từ chối: " + momoResponse.get("message"))
                        .build();
            }
        } catch (Exception e) {
            log.error("Lỗi tạo MoMo wallet topup: ", e);
            return MomoPaymentResponse.builder()
                    .success(false)
                    .message("Lỗi hệ thống: " + e.getMessage())
                    .build();
        }
    }
}
