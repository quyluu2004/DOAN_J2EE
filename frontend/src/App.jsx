import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from '@/components/ui/sonner';
import MiniCart from './components/MiniCart';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import PageTransition from './components/PageTransition';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import ProtectedRoute from './components/ProtectedRoute';
import RoomDesigner from './pages/RoomDesigner';
import MyDesigns from './pages/MyDesigns';

import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCollections from './pages/admin/AdminCollections';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import ColorManagement from './pages/admin/ColorManagement';
import MaterialManagement from './pages/admin/MaterialManagement';
import AdminTemplates from './pages/admin/AdminTemplates';

// Lấy Google Client ID từ biến môi trường
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// AnimatedRoutes component để sử dụng useLocation hook
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={
          <PageTransition>
            <HomePage />
          </PageTransition>
        } />
        <Route path="/checkout" element={
          <PageTransition>
            <Checkout />
          </PageTransition>
        } />
        <Route path="/orders" element={
          <PageTransition>
            <OrderHistory />
          </PageTransition>
        } />
        <Route path="/orders/:id" element={
          <PageTransition>
            <OrderDetail />
          </PageTransition>
        } />
        <Route path="/login" element={
          <PageTransition>
            <Login />
          </PageTransition>
        } />
        <Route path="/register" element={
          <PageTransition>
            <Register />
          </PageTransition>
        } />
        <Route path="/forgot-password" element={
          <PageTransition>
            <ForgotPassword />
          </PageTransition>
        } />
        <Route path="/reset-password" element={
          <PageTransition>
            <ResetPassword />
          </PageTransition>
        } />
        <Route path="/profile" element={
          <PageTransition>
            <Profile />
          </PageTransition>
        } />
        <Route path="/shop" element={
          <PageTransition>
            <Shop />
          </PageTransition>
        } />
        <Route path="/products/:id" element={
          <PageTransition>
            <ProductDetail />
          </PageTransition>
        } />
        <Route path="/about" element={
          <PageTransition>
            <About />
          </PageTransition>
        } />
        <Route path="/contact" element={
          <PageTransition>
            <Contact />
          </PageTransition>
        } />
        <Route path="/wishlist" element={
          <PageTransition>
            <Wishlist />
          </PageTransition>
        } />
        <Route path="/3d-designer" element={
          <PageTransition>
            <RoomDesigner />
          </PageTransition>
        } />
        <Route path="/my-designs" element={
          <PageTransition>
            <MyDesigns />
          </PageTransition>
        } />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="collections" element={<AdminCollections />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="colors" element={<ColorManagement />} />
            <Route path="materials" element={<MaterialManagement />} />
            <Route path="templates" element={<AdminTemplates />} />
            <Route path="templates/create" element={<RoomDesigner isAdmin={true} />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

import { LocalizationProvider } from './context/LocalizationContext';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LocalizationProvider>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <AnimatedRoutes />
              <MiniCart />
              <Toaster richColors position="top-right" />
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </GoogleOAuthProvider>
  )
}

export default App
