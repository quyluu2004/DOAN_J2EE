import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api/reviews`;

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

export const addReview = async (productId, rating, comment, mediaUrls) => {
    const response = await fetch(`${API_URL}/product/${productId}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ rating, comment, mediaUrls }),
    });

    if (!response.ok) {
        throw new Error("Gửi đánh giá thất bại");
    }

    return await response.json();
};

export const getReviews = async (productId) => {
    const response = await fetch(`${API_URL}/product/${productId}`, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Lấy danh sách đánh giá thất bại");
    }

    return await response.json();
};
