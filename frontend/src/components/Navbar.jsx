import React from 'react';
import { ShoppingCart, Search, Menu } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="w-full flex justify-between items-center py-8 px-6 md:px-16 max-w-[1440px] mx-auto bg-transparent z-50 absolute top-0 left-0 right-0">
            {/* Logo - Left */}
            <div className="text-2xl font-bold font-serif tracking-widest uppercase text-black z-50">
                ÉLITAN
            </div>

            {/* Links - Center */}
            <div className="hidden md:flex space-x-12 text-sm font-medium text-gray-500 tracking-wide absolute left-1/2 transform -translate-x-1/2">
                <a href="#" className="text-black font-semibold border-b-2 border-black pb-1">Home</a>
                <a href="#" className="hover:text-black transition-all duration-300">Furnitures</a>
                <a href="#" className="hover:text-black transition-all duration-300">Pricing</a>
                <a href="#" className="hover:text-black transition-all duration-300">Contact</a>
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden">
                <Menu className="w-6 h-6 text-gray-800" />
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-8">
                <button className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden md:block transition-colors">Login</button>
                <button className="bg-black text-white px-7 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg">
                    Sign up
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
