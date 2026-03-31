const API_URL = "/api/orders";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json"
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
};

export const sendOtp = async (phone) => {
    const response = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Gửi mã OTP thất bại");
    }
};

export const createOrder = async (orderData) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Đặt hàng thất bại");
    }

    return data;
};

export const getMyOrders = async () => {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Lấy danh sách đơn hàng thất bại");
    }

    return await response.json();
};

export const getOrderDetails = async (orderId) => {
    const response = await fetch(`${API_URL}/${orderId}`, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Lấy chi tiết đơn hàng thất bại");
    }

    return await response.json();
};

export const cancelOrder = async (orderId) => {
    const response = await fetch(`${API_URL}/${orderId}/cancel`, {
        method: "PUT",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Hủy đơn hàng thất bại");
    }

    return await response.json();
};

export const hardDeleteOrder = async (orderId) => {
    const response = await fetch(`${API_URL}/${orderId}/hard-delete`, {
        method: "DELETE",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Xóa cứng đơn hàng thất bại");
    }

    return await response.json();
};
