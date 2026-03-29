package com.elitan.backend.service;

import com.elitan.backend.dto.AddToCartRequest;
import com.elitan.backend.dto.CartItemResponse;
import com.elitan.backend.dto.CartResponse;
import com.elitan.backend.dto.UpdateCartItemRequest;
import com.elitan.backend.entity.Cart;
import com.elitan.backend.entity.CartItem;
import com.elitan.backend.entity.Product;
import com.elitan.backend.entity.User;
import com.elitan.backend.entity.ProductVariant;
import com.elitan.backend.repository.CartItemRepository;
import com.elitan.backend.repository.CartRepository;
import com.elitan.backend.repository.ProductRepository;
import com.elitan.backend.repository.ProductVariantRepository;
import com.elitan.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

        private final CartRepository cartRepository;
        private final CartItemRepository cartItemRepository;
        private final ProductRepository productRepository;
        private final ProductVariantRepository variantRepository;
        private final UserRepository userRepository;

        // Lấy giỏ hàng của user hiện tại (nếu chưa có thì tạo mới)
        @Transactional
        public CartResponse getCart(String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

                Cart cart = cartRepository.findByUserId(user.getId())
                                .orElseGet(() -> {
                                        Cart newCart = Cart.builder().user(user).build();
                                        return cartRepository.save(newCart);
                                });

                return mapToCartResponse(cart);
        }

        // Thêm sản phẩm vào giỏ hàng
        @Transactional
        public CartResponse addToCart(String userEmail, AddToCartRequest request) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

                Product product = productRepository.findById(request.getProductId())
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

                ProductVariant variant = variantRepository.findById(request.getVariantId())
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy biến thể sản phẩm"));

                Cart cart = cartRepository.findByUserId(user.getId())
                                .orElseGet(() -> {
                                        Cart newCart = Cart.builder().user(user).build();
                                        return cartRepository.save(newCart);
                                });

                // Kiểm tra xem biến thể đã có trong giỏ chưa
                cartItemRepository.findByCartIdAndVariantId(cart.getId(), variant.getId())
                                .ifPresentOrElse(
                                                existingItem -> {
                                                        existingItem.setQuantity(existingItem.getQuantity()
                                                                        + request.getQuantity());
                                                        cartItemRepository.save(existingItem);
                                                },
                                                () -> {
                                                        CartItem newItem = CartItem.builder()
                                                                        .cart(cart)
                                                                        .variant(variant)
                                                                        .quantity(request.getQuantity())
                                                                        .build();
                                                        cartItemRepository.save(newItem);
                                                });

                return mapToCartResponse(cart);
        }

        // Cập nhật số lượng
        @Transactional
        public CartResponse updateCartItem(String userEmail, Long itemId, UpdateCartItemRequest request) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

                Cart cart = cartRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Giỏ hàng trống"));

                CartItem item = cartItemRepository.findById(itemId)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ"));

                // Xác thực item thuộc về cart của user
                if (!item.getCart().getId().equals(cart.getId())) {
                        throw new RuntimeException("Không có quyền truy cập");
                }

                item.setQuantity(request.getQuantity());
                cartItemRepository.save(item);

                return mapToCartResponse(cart);
        }

        // Xóa item khỏi giỏ
        @Transactional
        public CartResponse removeCartItem(String userEmail, Long itemId) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

                Cart cart = cartRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Giỏ hàng trống"));

                CartItem item = cartItemRepository.findById(itemId)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ"));

                if (!item.getCart().getId().equals(cart.getId())) {
                        throw new RuntimeException("Không có quyền truy cập");
                }

                cartItemRepository.delete(item);

                return mapToCartResponse(cart);
        }

        // Xóa toàn bộ giỏ (sau khi thanh toán)
        @Transactional
        public void clearCart(String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

                cartRepository.findByUserId(user.getId()).ifPresent(cart -> {
                        cartItemRepository.deleteByCartId(cart.getId());
                });
        }

        // Mapper helper
        private CartResponse mapToCartResponse(Cart cart) {
                List<CartItem> items = cartItemRepository.findByCartId(cart.getId());

                List<CartItemResponse> itemResponses = items.stream().map(item -> {
                        ProductVariant variant = item.getVariant();
                        Product product = variant.getProduct();
                        BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

                        return CartItemResponse.builder()
                                        .id(item.getId())
                                        .productId(product.getId())
                                        .variantId(variant.getId())
                                        .name(product.getName())
                                        .category(product.getCategory())
                                        .price(product.getPrice())
                                        .imageUrl(variant.getImageUrl() != null ? variant.getImageUrl() : product.getImageUrl())
                                        .thumbnailUrl(product.getThumbnailUrl())
                                        .color(variant.getColor())
                                        .material(product.getMaterial())
                                        .dimensions(product.getDimensions())
                                        .quantity(item.getQuantity())
                                        .itemTotal(itemTotal)
                                        .build();
                }).collect(Collectors.toList());

                BigDecimal subTotal = itemResponses.stream()
                                .map(CartItemResponse::getItemTotal)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                Integer totalItems = itemResponses.stream()
                                .map(CartItemResponse::getQuantity)
                                .reduce(0, Integer::sum);

                return CartResponse.builder()
                                .cartId(cart.getId())
                                .items(itemResponses)
                                .subTotal(subTotal)
                                .totalItems(totalItems)
                                .build();
        }
}
