// authService.js - Gọi API Backend cho Login/Register/Social Login
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api/auth`;

// Đăng ký tài khoản (backend trả về token → auto-login)
export const register = async (fullName, email, password) => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Đăng ký thất bại");
    }

    // Lưu token và thông tin user vào localStorage (auto-login sau đăng ký)
    if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({
            id: data.userId,
            email: data.email,
            fullName: data.fullName,
            role: data.role,
            discordUserId: data.discordUserId,
            twoFactorEnabled: data.twoFactorEnabled,
        }));
    }

    return data;
};

// Đăng nhập
export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Đăng nhập thất bại");
    }

    // Nếu yêu cầu 2FA, không lưu token ngay
    if (data.twoFactorRequired) {
        return data;
    }

    // Lưu token và thông tin user vào localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({
        id: data.userId,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        discordUserId: data.discordUserId,
        twoFactorEnabled: data.twoFactorEnabled,
    }));
    return data;
};

// Xác minh 2FA
export const verify2FA = async (email, code) => {
    const response = await fetch(`${API_URL}/verify-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Xác minh 2FA thất bại");
    }

    // Sau khi verify thành công → Lưu token
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({
        id: data.userId,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        discordUserId: data.discordUserId,
        twoFactorEnabled: data.twoFactorEnabled,
    }));
    return data;
};

// Đăng nhập bằng Google hoặc Facebook
export const socialLogin = async (token, provider) => {
    const response = await fetch(`${API_URL}/social-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, provider }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Đăng nhập bằng " + provider + " thất bại");
    }

    // Lưu token và thông tin user vào localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({
        id: data.userId,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        discordUserId: data.discordUserId,
        twoFactorEnabled: data.twoFactorEnabled,
    }));

    return data;
};

// Đăng xuất
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

// Lấy token
export const getToken = () => {
    return localStorage.getItem("token");
};

// Lấy thông tin user
export const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

// Kiểm tra đã đăng nhập chưa
export const isAuthenticated = () => {
    return !!getToken();
};

// Quên mật khẩu — gửi email reset
export const forgotPassword = async (email) => {
    const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Gửi yêu cầu thất bại");
    }

    return data;
};

// Đặt lại mật khẩu với token
export const resetPassword = async (token, newPassword) => {
    const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Đặt lại mật khẩu thất bại");
    }

    return data;
};
