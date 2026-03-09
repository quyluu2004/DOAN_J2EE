import React, { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService";

// Tạo Context
const AuthContext = createContext(null);

// Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Khôi phục trạng thái đăng nhập từ localStorage khi load app
    useEffect(() => {
        const savedUser = authService.getCurrentUser();
        const token = authService.getToken();
        if (savedUser && token) {
            setUser(savedUser);
        }
        setLoading(false);
    }, []);

    // Đăng nhập thường
    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setUser({
            email: data.email,
            fullName: data.fullName,
            role: data.role,
        });
        return data;
    };

    // Đăng nhập bằng Google/Facebook
    const socialLogin = async (token, provider) => {
        const data = await authService.socialLogin(token, provider);
        setUser({
            email: data.email,
            fullName: data.fullName,
            role: data.role,
        });
        return data;
    };

    // Đăng ký (auto-login sau đăng ký vì backend trả về token)
    const register = async (fullName, email, password) => {
        const data = await authService.register(fullName, email, password);
        if (data.token) {
            setUser({
                email: data.email,
                fullName: data.fullName,
                role: data.role,
            });
        }
        return data;
    };

    // Đăng xuất
    const logout = () => {
        authService.logout();
        setUser(null);
    };

    // Cập nhật user state (dùng khi edit profile)
    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
        // Cập nhật localStorage
        const saved = authService.getCurrentUser();
        if (saved) {
            localStorage.setItem("user", JSON.stringify({ ...saved, ...userData }));
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        socialLogin,
        register,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Hook để sử dụng AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth phải được sử dụng trong AuthProvider");
    }
    return context;
};
