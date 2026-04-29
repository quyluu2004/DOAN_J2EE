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
        
        // Nếu yêu cầu 2FA, trả về data để UI xử lý, chưa set user
        if (data.twoFactorRequired) {
            return data;
        }

        setUser({
            id: data.userId,
            email: data.email,
            fullName: data.fullName,
            role: data.role,
            discordUserId: data.discordUserId,
            twoFactorEnabled: data.twoFactorEnabled,
        });
        return data;
    };

    // Xác minh 2FA và hoàn tất đăng nhập
    const verify2FA = async (email, code) => {
        const data = await authService.verify2FA(email, code);
        setUser({
            id: data.userId,
            email: data.email,
            fullName: data.fullName,
            role: data.role,
            discordUserId: data.discordUserId,
            twoFactorEnabled: data.twoFactorEnabled,
        });
        return data;
    };

    // Đăng nhập bằng Google/Facebook
    const socialLogin = async (token, provider) => {
        const data = await authService.socialLogin(token, provider);
        
        // Nếu yêu cầu 2FA, trả về data để UI xử lý, chưa set user
        if (data.twoFactorRequired) {
            return data;
        }

        setUser({
            id: data.userId,
            email: data.email,
            fullName: data.fullName,
            role: data.role,
            discordUserId: data.discordUserId,
            twoFactorEnabled: data.twoFactorEnabled,
        });
        return data;
    };

    // Đăng ký (auto-login sau đăng ký vì backend trả về token)
    const register = async (fullName, email, password) => {
        const data = await authService.register(fullName, email, password);
        if (data.token) {
            setUser({
                id: data.userId,
                email: data.email,
                fullName: data.fullName,
                role: data.role,
                discordUserId: data.discordUserId,
                twoFactorEnabled: data.twoFactorEnabled,
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
        verify2FA,
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
