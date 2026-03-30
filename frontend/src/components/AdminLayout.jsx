import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, Folders, ShoppingCart, Users, LogOut, Palette, Box, Layers } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { title: 'Products', icon: Package, path: '/admin/products' },
    { title: '3D Models', icon: Layers, path: '/admin/3d-models' },
    { title: 'Collections', icon: Folders, path: '/admin/collections' },
    { title: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { title: 'Users', icon: Users, path: '/admin/users' },
    { title: 'Colors', icon: Palette, path: '/admin/colors' },
    { title: 'Materials', icon: Box, path: '/admin/materials' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f9f9f9] text-[#1a1c1c] font-sans selection:bg-[#4f3700] selection:text-white">
      {/* Sidebar - Seamless integration */}
      <aside className="w-72 bg-[#f3f3f3] fixed h-full flex flex-col font-sans">
        <div className="pt-16 pb-12 px-10">
          <h1 className="text-2xl font-serif tracking-[0.2em] text-[#000000]">ÉTALIAN</h1>
          <p className="text-[0.65rem] tracking-[0.3em] text-[#775a19] uppercase mt-3 font-semibold">Digital Atelier</p>
        </div>
        <nav className="px-6 flex-1 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-4 px-5 py-4 transition-all duration-500 rounded-none ${isActive ? 'bg-white text-black shadow-[0_2px_10px_rgba(0,0,0,0.02)]' : 'text-[#777777] hover:text-black hover:bg-[#e8e8e8]'}`}
              >
                <item.icon className="w-5 h-5 stroke-[1.2]" />
                <span className="font-semibold text-[0.85rem] tracking-wide uppercase">{item.title}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-8">
          <div className="px-5 py-5 mb-4 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between rounded-none">
            <div>
              <p className="text-sm font-semibold tracking-wide">{user.fullName}</p>
              <p className="text-[0.65rem] tracking-widest text-[#775a19] uppercase mt-1">Master Curator</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-4 px-5 py-4 w-full text-black hover:bg-[#e8e8e8] transition-colors rounded-none"
          >
            <LogOut className="w-5 h-5 stroke-[1.2]" />
            <span className="font-semibold text-[0.85rem] tracking-wide uppercase">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-16 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
