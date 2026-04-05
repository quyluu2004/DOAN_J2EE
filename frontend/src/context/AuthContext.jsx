import React, { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService";
import * as userService from "../services/userService";

// Tạo Context
const AuthContext = createContext(null);

// Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Khôi phục trạng thái đăng nhập từ localStorage khi load app
    useEffect(() => {
        const initAuth = async () => {
            const savedUser = authService.getCurrentUser();
            const token = authService.getToken();
            if (savedUser && token) {
                setUser(savedUser);
                // Đồng bộ lại profile để cập nhật VIP status mới nhất
                await refreshProfile();
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    // Đăng nhập thường
    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setUser({
            email: data.email,
            fullName: data.fullName,
            role: data.role,
            vip: data.vip,
            vipExpiresAt: data.vipExpiresAt,
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
            vip: data.vip,
            vipExpiresAt: data.vipExpiresAt,
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
                vip: data.vip,
                vipExpiresAt: data.vipExpiresAt,
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
            const newUser = { ...saved, ...userData };
            localStorage.setItem("user", JSON.stringify(newUser));
        }
    };

    // Lấy dữ liệu profile mới nhất từ server
    const refreshProfile = async () => {
        try {
            const data = await userService.getProfile();
            updateUser({
                vip: data.vip,
                vipExpiresAt: data.vipExpiresAt,
                role: data.role,
                fullName: data.fullName,
                avatarUrl: data.avatarUrl
            });
            return data;
        } catch (error) {
            console.error("Failed to refresh profile:", error);
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
        refreshProfile,
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
