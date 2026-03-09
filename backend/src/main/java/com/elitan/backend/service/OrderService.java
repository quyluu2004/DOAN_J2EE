package com.elitan.backend.service;

import com.elitan.backend.dto.OrderDetailResponse;
import com.elitan.backend.dto.OrderRequest;
import com.elitan.backend.dto.OrderResponse;
import com.elitan.backend.entity.*;
import com.elitan.backend.repository.CartItemRepository;
import com.elitan.backend.repository.CartRepository;
import com.elitan.backend.repository.OrderDetailRepository;
import com.elitan.backend.repository.OrderRepository;
import com.elitan.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

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
            return OrderDetail.builder()
                    .order(savedOrder)
                    .product(p)
                    .productName(p.getName())
                    .productImage(p.getImageUrl())
                    .priceAtPurchase(p.getPrice())
                    .quantity(item.getQuantity())
                    .color(p.getColor())
                    .material(p.getMaterial())
                    .dimensions(p.getDimensions())
                    .build();
        }).collect(Collectors.toList());

        orderDetailRepository.saveAll(orderDetails);

        // Xóa giỏ hàng
        cartItemRepository.deleteByCartId(cart.getId());

        return mapToOrderResponse(savedOrder, orderDetails);
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

        order.setStatus("CANCELLED");
        orderRepository.save(order);

        List<OrderDetail> details = orderDetailRepository.findByOrderId(order.getId());
        return mapToOrderResponse(order, details);
    }

    // Mapper
    private OrderResponse mapToOrderResponse(Order order, List<OrderDetail> details) {
        List<OrderDetailResponse> items = details.stream().map(d -> OrderDetailResponse.builder()
                .id(d.getId())
                .productId(d.getProduct().getId())
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
