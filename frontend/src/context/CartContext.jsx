import React, { createContext, useContext, useState, useEffect } from "react";
import * as cartService from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState({ items: [], subTotal: 0, totalItems: 0 });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch cart khi user đăng nhập thành công
    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            // Xóa cart state khi đăng xuất
            setCart({ items: [], subTotal: 0, totalItems: 0 });
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const data = await cartService.getCart();
            setCart(data);
            setError(null);
        } catch (err) {
            console.error("Fetch cart error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, variantId, quantity = 1) => {
        if (!isAuthenticated) {
            // Có thể redirect user đến trang login hoặc hiện thông báo
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
            return;
        }

        try {
            setLoading(true);
            const data = await cartService.addToCart(productId, variantId, quantity);
            setCart(data);
            setIsCartOpen(true); // Tự động mở drawer sau khi thêm
            setError(null);
        } catch (err) {
            console.error("Add to cart error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        const previousCart = { ...cart };

        try {
            // Optimistic UI update (cập nhật UI ngay lập tức cho mượt, xử lý lỗi sau)
            setCart(prevCart => {
                const newItems = prevCart.items.map(i =>
                    i.id === itemId
                        ? { ...i, quantity, itemTotal: i.price * quantity }
                        : i
                );
                const newSubTotal = newItems.reduce((sum, i) => sum + i.itemTotal, 0);
                const newTotalItems = newItems.reduce((sum, i) => sum + i.quantity, 0);
                return { ...prevCart, items: newItems, subTotal: newSubTotal, totalItems: newTotalItems };
            });

            // Gọi API ngầm mà không block UI
            const data = await cartService.updateQuantity(itemId, quantity);
            setCart(data); // Đồng bộ lại với server data
        } catch (err) {
            console.error("Update quantity error:", err);
            setError(err.message);
            setCart(previousCart); // Revert back nế có lỗi
        }
    };

    const removeItem = async (itemId) => {
        const previousCart = { ...cart };

        try {
            // Optimistic UI update - loại bỏ ngay lập tức khỏi view
            setCart(prevCart => {
                const newItems = prevCart.items.filter(i => i.id !== itemId);
                const newSubTotal = newItems.reduce((sum, i) => sum + i.itemTotal, 0);
                const newTotalItems = newItems.reduce((sum, i) => sum + i.quantity, 0);
                return { ...prevCart, items: newItems, subTotal: newSubTotal, totalItems: newTotalItems };
            });

            // Gửi API ở dưới nền
            const data = await cartService.removeItem(itemId);
            setCart(data); // Đồng bộ
        } catch (err) {
            console.error("Remove item error:", err);
            setError(err.message);
            setCart(previousCart); // Rollback
        }
    };

    const clearCartLocal = () => {
        setCart({ items: [], subTotal: 0, totalItems: 0 });
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const closeCart = () => setIsCartOpen(false);
    const openCart = () => setIsCartOpen(true);

    const value = {
        cart,
        isCartOpen,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeItem,
        clearCartLocal,
        fetchCart,
        toggleCart,
        closeCart,
        openCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart phải được sử dụng trong CartProvider");
    }
    return context;
};
