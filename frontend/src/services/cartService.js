
const API_URL = "/api/cart";

// Helper to get auth headers
const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

export const getCart = async () => {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeaders(),
    });

    // If 401/403, might need to login
    if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu giỏ hàng");
    }

    return await response.json();
};

export const addToCart = async (productId, variantId, quantity = 1) => {
    const response = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ productId, variantId, quantity }),
    });

    if (!response.ok) {
        throw new Error("Thêm vào giỏ hàng thất bại");
    }

    return await response.json();
};

export const updateQuantity = async (itemId, quantity) => {
    const response = await fetch(`${API_URL}/items/${itemId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
        throw new Error("Cập nhật số lượng thất bại");
    }

    return await response.json();
};

export const removeItem = async (itemId) => {
    const response = await fetch(`${API_URL}/items/${itemId}`, {
        method: "DELETE",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Xóa sản phẩm thất bại");
    }

    return await response.json();
};

export const clearCart = async () => {
    const response = await fetch(API_URL, {
        method: "DELETE",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Xóa giỏ hàng thất bại");
    }

    return true;
};
