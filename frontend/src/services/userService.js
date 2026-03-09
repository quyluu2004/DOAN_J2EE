// userService.js — Gọi API cho Profile (cần JWT auth)

import { getToken } from "./authService";

const API_URL = "/api/users";

// Helper: tạo headers với JWT token
const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
});

// Lấy thông tin profile
export const getProfile = async () => {
    const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: authHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Lấy thông tin thất bại");
    }

    return data;
};

// Cập nhật profile
export const updateProfile = async (profileData) => {
    const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Cập nhật thất bại");
    }

    return data;
};

// Đổi mật khẩu
export const changePassword = async (currentPassword, newPassword) => {
    const response = await fetch(`${API_URL}/change-password`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Đổi mật khẩu thất bại");
    }

    return data;
};
