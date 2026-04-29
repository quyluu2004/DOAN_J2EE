// userService.js — Gọi API cho Profile (cần JWT auth)

import { getToken } from "./authService";
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api/users`;

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

// Liên kết Discord
export const linkDiscord = async (userId) => {
    const response = await fetch(`${API_URL}/link-discord`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ userId }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Liên kết Discord thất bại");
    }

    return data;
};

// Bật/tắt 2FA
export const toggle2FA = async (enabled) => {
    const response = await fetch(`${API_URL}/toggle-2fa`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ enabled }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Cập nhật 2FA thất bại");
    }

    return data;
};
