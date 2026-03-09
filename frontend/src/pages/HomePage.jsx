import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, ArrowRight, ChevronRight, ChevronLeft, Plus, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const HomePage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [products, setProducts] = useState([]);
    const { user, isAuthenticated, logout } = useAuth();
    const { cart, openCart, addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        // Fetch products
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data.slice(0, 4))) // Grab first 4 for best sellers
            .catch(err => console.error(err));

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAddToCart = (productId) => {
        addToCart(productId, 1);
    };

    return (
        <div className="font-['Plus_Jakarta_Sans'] bg-[#F5F5F7] min-h-screen text-gray-900 selection:bg-black selection:text-white">

            {/* 1. HEADER (Navbar) */}
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    {/* Logo */}
                    <div className="text-2xl font-bold tracking-tighter">
                        ÉLITAN
                    </div>

                    {/* Menu - Desktop */}
                    <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
                        {['Home', 'Furniture', 'Pricing', 'Contact'].map((item) => (
                            <a key={item} href="#" className="hover:text-black transition-colors duration-200">
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Cart Icon */}
                        <button onClick={openCart} className="relative p-2 text-gray-900 hover:text-black transition">
                            <ShoppingCart className="w-5 h-5" />
                            {cart?.totalItems > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                                    {cart.totalItems}
                                </span>
                            )}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <span className="hidden md:block text-sm font-medium text-gray-600 ml-4">
                                    Xin chào, {user?.fullName?.split(' ')[0]}
                                </span>
                                <Link to="/orders" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black transition">
                                    Orders
                                </Link>
                                <button
                                    onClick={() => { logout(); navigate('/'); }}
                                    className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-red-600 transition"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hidden md:block text-sm font-medium text-gray-600 hover:text-black transition ml-4">Login</Link>
                                <Link to="/register" className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
                                    Sign up
                                </Link>
                            </>
                        )}
                        <button className="md:hidden">
                            <Menu className="w-6 h-6 text-gray-900" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* 2. HERO SECTION */}
            <Hero />

            {/* 3. CURATED COLLECTIONS */}
            <section className="py-20 max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">CURATED COLLECTIONS<br />FOR EVERY SPACE</h2>
                    <a href="#" className="hidden md:flex items-center gap-2 text-sm font-medium border-b border-black pb-0.5 hover:text-gray-600 transition">
                        View All Collections <ArrowRight className="w-4 h-4" />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[600px]">

                    {/* Item 1: Living Room (Big) */}
                    <div className="col-span-1 md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2rem] cursor-pointer">
                        <img
                            src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1000"
                            alt="Living Room"
                            className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                        <div className="absolute bottom-8 left-8 text-white">
                            <h3 className="text-2xl font-bold mb-1">LIVING ROOM</h3>
                            <button className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full text-xs font-semibold hover:bg-white hover:text-black transition">
                                EXPLORE
                            </button>
                        </div>
                    </div>

                    {/* Item 2: Dining */}
                    <div className="col-span-1 md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-[2rem] cursor-pointer">
                        <img
                            src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800"
                            alt="Dining"
                            className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <h3 className="text-xl font-bold">DINING</h3>
                        </div>
                    </div>

                    {/* Item 3: Bedroom */}
                    <div className="col-span-1 md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-[2rem] cursor-pointer">
                        <img
                            src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800"
                            alt="Bedroom"
                            className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <h3 className="text-xl font-bold">BEDROOM</h3>
                        </div>
                    </div>

                </div>
            </section>

            {/* 4. BEST SELLERS */}
            <section className="py-20 bg-white rounded-t-[3rem] mt-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-bold uppercase tracking-tight">Best Sellers</h2>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">Loading products...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="group cursor-pointer">
                                    <div className="bg-[#F5F5F7] rounded-3xl p-8 mb-4 relative h-[350px] flex items-center justify-center">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition duration-500"
                                        />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleAddToCart(product.id); }}
                                            className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors duration-300"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{product.name}</h3>
                                        <p className="text-gray-500 font-medium">${product.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* 5. 3D STUDIO BANNER */}
            <section className="bg-[#111827] text-white py-0 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[500px]">
                    <div className="py-12 z-10">
                        <span className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-4 block">
                            The 3D Studio Experience
                        </span>
                        <h2 className="text-5xl font-bold mb-6 leading-tight">
                            VISUALIZE YOUR<br />DREAM HOME.<br />IN 3D.
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-md">
                            Experience luxury interiors before you buy. Customize colors, materials and layout in our real-time 3D studio.
                        </p>
                        <button className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold hover:bg-gray-200 transition shadow-lg">
                            TRY 3D STUDIO NOW
                        </button>
                    </div>

                    <div className="relative h-full flex items-center justify-center">
                        {/* Abstract 3D Room Image Placeholder */}
                        <div className="relative w-full h-[400px]">
                            <img
                                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000"
                                alt="3D Room"
                                className="absolute inset-0 w-full h-full object-cover rounded-tl-[3rem] opacity-80"
                                style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)' }}
                            />
                            {/* Overlay isometric grid feel */}
                            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#111827]" />
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER (Simple) */}
            <footer className="bg-[#111827] text-white py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; 2026 ÉLITAN. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Service</a>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default HomePage;
