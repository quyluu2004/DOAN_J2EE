import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function ProtectedRoute({ adminOnly = false }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-serif text-xl">Loading...</div>;
  }

  if (!isAuthenticated) {
    toast.error("Vui lòng đăng nhập để tiếp tục.");
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'ADMIN') {
    toast.error("Bạn không có quyền truy cập trang quản trị.");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
