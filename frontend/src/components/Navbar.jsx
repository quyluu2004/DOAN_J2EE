import React from 'react';
import { Menu, Search, ShoppingCart, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Furnitures', href: '#furniture' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Contact', href: '#contact' }
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="w-full flex justify-between items-center py-6 px-6 md:px-16 max-w-[1440px] mx-auto bg-transparent z-50 absolute top-0 left-0 right-0">
            {/* Logo - Left */}
            <Link to="/" className="text-2xl font-bold font-serif tracking-widest uppercase text-black z-50 cursor-pointer no-underline">
                ÉLITAN
            </Link>

            {/* Links - Center (Minimalist Text) */}
            <div className="hidden md:flex items-center space-x-12 absolute left-1/2 transform -translate-x-1/2">
                {navItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className="relative text-sm font-medium text-gray-800 hover:text-black transition-colors duration-300 group"
                    >
                        {item.label}
                        <span className="absolute left-0 bottom-[-4px] w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                    </a>
                ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-6 z-50">
                <button className="text-gray-900 hover:text-gray-600 transition-colors">
                    <Search className="w-5 h-5" />
                </button>
                <button className="text-gray-900 hover:text-gray-600 transition-colors relative">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">0</span>
                </button>
                <button className="md:hidden">
                    <Menu className="w-6 h-6 text-gray-900" />
                </button>

                {/* Auth Buttons - Thay đổi theo trạng thái đăng nhập */}
                <div className="hidden md:flex items-center space-x-4 ml-2">
                    {isAuthenticated ? (
                        <>
                            <span className="text-sm font-medium text-gray-700">
                                Xin chào, {user?.fullName?.split(' ')[0]}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-300 no-underline">
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

