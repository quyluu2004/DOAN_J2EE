// authService.js - Gọi API Backend cho Login/Register/Social Login

const API_URL = "/api/auth";

// Đăng ký tài khoản
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

    // Lưu token và thông tin user vào localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({
        email: data.email,
        fullName: data.fullName,
        role: data.role,
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
        email: data.email,
        fullName: data.fullName,
        role: data.role,
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
