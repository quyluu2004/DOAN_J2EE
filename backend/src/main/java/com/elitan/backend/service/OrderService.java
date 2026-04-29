package com.elitan.backend.service;

import com.elitan.backend.dto.OrderDetailResponse;
import com.elitan.backend.dto.OrderRequest;
import com.elitan.backend.dto.OrderResponse;
import com.elitan.backend.entity.*;
import com.elitan.backend.repository.CartItemRepository;
import com.elitan.backend.repository.CartRepository;
import com.elitan.backend.repository.OrderDetailRepository;
import com.elitan.backend.repository.OrderRepository;
import com.elitan.backend.repository.ProductRepository;
import com.elitan.backend.repository.ProductVariantRepository;
import com.elitan.backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final OTPService otpService;
    private final PdfService pdfService;
    private final EmailService emailService;

    public OrderService(OrderRepository orderRepository,
                        OrderDetailRepository orderDetailRepository,
                        CartRepository cartRepository,
                        CartItemRepository cartItemRepository,
                        UserRepository userRepository,
                        ProductRepository productRepository,
                        ProductVariantRepository variantRepository,
                        OTPService otpService,
                        PdfService pdfService,
                        EmailService emailService) {
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
        this.otpService = otpService;
        this.pdfService = pdfService;
        this.emailService = emailService;
    }

    // Trigger OTP sending to Zalo/Phone
    public void sendCheckoutOTP(String userEmail, String phone) {
        otpService.generateOTP(phone);
    }

    // Đặt hàng từ giỏ (Checkout)
    @Transactional
    public OrderResponse createOrder(String userEmail, OrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Giỏ hàng trống"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống, không thể đặt hàng");
        }

        // VERIFY OTP (Sent to Email)
        if (request.getOtpCode() == null || !otpService.verifyOTP(userEmail, request.getOtpCode())) {
            throw new RuntimeException("Mã xác thực OTP không chính xác hoặc đã hết hạn");
        }

        // Check Inventory & Calculate totals
        for (CartItem item : cartItems) {
            Product p = item.getProduct();
            ProductVariant v = item.getVariant();
            Integer stock = (v != null) ? v.getStock() : p.getStock();
            
            if (stock == null || stock < item.getQuantity()) {
                String name = p.getName() + (v != null ? " (" + v.getColor() + ")" : "");
                throw new RuntimeException("Sản phẩm " + name + " không đủ số lượng trong kho");
            }
        }

        // Tính tổng tiền
        BigDecimal subTotal = cartItems.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Tính phí ship (ví dụ: STANDARD free cho đơn > $500, WHITE_GLOVE = $150)
        BigDecimal shippingFee = BigDecimal.ZERO;
        if ("WHITE_GLOVE".equals(request.getShippingMethod())) {
            shippingFee = new BigDecimal("150.00");
        } else if ("STANDARD".equals(request.getShippingMethod()) && subTotal.compareTo(new BigDecimal("500")) < 0) {
            shippingFee = new BigDecimal("30.00"); // Ví dụ phí ship cơ bản
        }

        BigDecimal totalPrice = subTotal.add(shippingFee);

        // Tính tiền cọc (Deposit 30% nếu yêu cầu, logic này có thể mở rộng)
        BigDecimal depositAmount = BigDecimal.ZERO;
        if (request.getNote() != null && request.getNote().contains("DEPOSIT_30")) {
            depositAmount = totalPrice.multiply(new BigDecimal("0.3")).setScale(2, java.math.RoundingMode.HALF_UP);
        }

        // Tạo mã tracking ngắn gọn
        String trackingNumber = "#ORD-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        // Tạo Order
        Order order = Order.builder()
                .user(user)
                .trackingNumber(trackingNumber)
                .totalPrice(totalPrice)
                .shippingFee(shippingFee)
                .status("PENDING") // Chờ xác nhận
                .shippingName(request.getShippingName())
                .shippingPhone(request.getShippingPhone())
                .shippingAddress(request.getShippingAddress())
                .shippingMethod(request.getShippingMethod())
                .paymentMethod(request.getPaymentMethod())
                .depositAmount(depositAmount)
                .note(request.getNote())
                .build();

        Order savedOrder = orderRepository.save(order);

        // Tạo OrderDetail (Snapshot product data)
        List<OrderDetail> orderDetails = cartItems.stream().map(item -> {
            Product p = item.getProduct();
            ProductVariant v = item.getVariant();
            return OrderDetail.builder()
                    .order(savedOrder)
                    .product(p)
                    .variant(v)
                    .productName(p.getName())
                    .productImage(v != null && v.getImageUrl() != null ? v.getImageUrl() : p.getImageUrl())
                    .priceAtPurchase(p.getPrice())
                    .quantity(item.getQuantity())
                    .color(v != null ? v.getColor() : p.getColor())
                    .material(p.getMaterial())
                    .dimensions(p.getDimensions())
                    .build();
        }).collect(Collectors.toList());

        orderDetailRepository.saveAll(orderDetails);

        // DECREMENT STOCK
        for (CartItem item : cartItems) {
            ProductVariant v = item.getVariant();
            if (v != null) {
                int currentStock = v.getStock() != null ? v.getStock() : 0;
                v.setStock(currentStock - item.getQuantity());
                variantRepository.save(v);
            } else {
                Product p = item.getProduct();
                int currentStock = p.getStock() != null ? p.getStock() : 0;
                p.setStock(currentStock - item.getQuantity());
                productRepository.save(p);
            }
        }

        // Xóa giỏ hàng
        cartItemRepository.deleteByCartId(cart.getId());

        OrderResponse response = mapToOrderResponse(savedOrder, orderDetails);

        // Phát sinh PDF và gửi Email chạy ngầm (Async) để không block luồng thanh toán
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                java.util.Map<String, Object> variables = new java.util.HashMap<>();
                variables.put("order", response);
                byte[] pdfBytes = pdfService.generatePdfFromHtml("invoice", variables);
                emailService.sendOrderConfirmation(userEmail, response.getTrackingNumber(), pdfBytes);
            } catch (Exception e) {
                System.err.println("Async Email Sending Failed: " + e.getMessage());
            }
        });

        return response;
    }

    // Lấy lịch sử mua hàng của user
    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        return orders.stream().map(order -> {
            List<OrderDetail> details = orderDetailRepository.findByOrderId(order.getId());
            return mapToOrderResponse(order, details);
        }).collect(Collectors.toList());
    }

    // Lấy chi tiết 1 đơn hàng
    @Transactional(readOnly = true)
    public OrderResponse getOrderDetails(String userEmail, Long orderId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Không có quyền truy cập đơn hàng này");
        }

        List<OrderDetail> details = orderDetailRepository.findByOrderId(order.getId());
        return mapToOrderResponse(order, details);
    }

    // Hủy đơn hàng
    @Transactional
    public OrderResponse cancelOrder(String userEmail, Long orderId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Không có quyền truy cập");
        }

        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Chỉ có thể hủy đơn hàng đang ở trạng thái chờ xác nhận");
        }

        if (!"CANCELLED".equals(order.getStatus())) {
            restockInventory(order);
        }
        order.setStatus("CANCELLED");
        orderRepository.save(order);

        List<OrderDetail> details = orderDetailRepository.findByOrderId(order.getId());
        return mapToOrderResponse(order, details);
    }

    // Lấy tất cả đơn hàng (cho Admin)
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream().map(order -> {
            List<OrderDetail> details = orderDetailRepository.findByOrderId(order.getId());
            return mapToOrderResponse(order, details);
        }).collect(Collectors.toList());
    }

    // Cập nhật trạng thái đơn hàng (cho Admin)
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        if ("CANCELLED".equals(status) && !"CANCELLED".equals(order.getStatus())) {
            restockInventory(order);
        }
        order.setStatus(status);
        orderRepository.save(order);
        List<OrderDetail> details = orderDetailRepository.findByOrderId(order.getId());
        return mapToOrderResponse(order, details);
    }

    private void restockInventory(Order order) {
        List<OrderDetail> details = orderDetailRepository.findByOrderId(order.getId());
        for (OrderDetail detail : details) {
            ProductVariant v = detail.getVariant();
            if (v != null) {
                v.setStock(v.getStock() + detail.getQuantity());
                variantRepository.save(v);
            } else {
                Product p = detail.getProduct();
                if (p != null) {
                    p.setStock(p.getStock() + detail.getQuantity());
                    productRepository.save(p);
                }
            }
        }
    }

    // Mapper
    private OrderResponse mapToOrderResponse(Order order, List<OrderDetail> details) {
        List<OrderDetailResponse> items = details.stream().map(d -> OrderDetailResponse.builder()
                .id(d.getId())
                .productId(d.getProduct().getId())
                .variantId(d.getVariant() != null ? d.getVariant().getId() : null)
                .productName(d.getProductName())
                .productImage(d.getProductImage())
                .color(d.getColor())
                .material(d.getMaterial())
                .dimensions(d.getDimensions())
                .quantity(d.getQuantity())
                .priceAtPurchase(d.getPriceAtPurchase())
                .itemTotal(d.getPriceAtPurchase().multiply(BigDecimal.valueOf(d.getQuantity())))
                .build()).collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .trackingNumber(order.getTrackingNumber())
                .status(order.getStatus())
                .totalPrice(order.getTotalPrice())
                .shippingFee(order.getShippingFee())
                .depositAmount(order.getDepositAmount())
                .shippingName(order.getShippingName())
                .shippingPhone(order.getShippingPhone())
                .shippingAddress(order.getShippingAddress())
                .shippingMethod(order.getShippingMethod())
                .paymentMethod(order.getPaymentMethod())
                .note(order.getNote())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}
