import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, LogOut, Heart, Globe, ChevronDown, Check } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLocalization } from '@/context/LocalizationContext';


const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const { cart, openCart } = useCart();
    const { lang, setLang, currency, setCurrency, t } = useLocalization();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Hide Navbar on specific routes
    const hiddenRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
    const isHiddenRoute = hiddenRoutes.includes(location.pathname) || location.pathname.startsWith('/admin');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        const handleClickOutside = (e) => {
            if (!e.target.closest('.settings-dropdown')) {
                setIsSettingsOpen(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    if (isHiddenRoute) return null;

    // Make the navbar background less transparent on non-home pages to ensure visibility against the Tuscan background
    const isHomePage = location.pathname === '/';
    const navBackground = isScrolled 
        ? 'bg-white/80 backdrop-blur-md py-4 shadow-sm' 
        : isHomePage 
            ? 'bg-transparent py-6' 
            : 'bg-[#fff8f3] py-6 shadow-sm'; // Warm background for non-home pages like Shop

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navBackground}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold tracking-tighter text-[#221a0c]">
                    ÉLITAN
                </Link>

                {/* Menu - Desktop */}
                <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
                    {[
                        { label: t('nav.home'), to: '/' },
                        { label: t('nav.shop'), to: '/shop' },
                        { label: '3D Studio', to: '/3d-designer' },
                        { label: t('nav.about'), to: '/about' },
                        { label: t('nav.contact'), to: '/contact' }
                    ].map((item) => (
                        <Link 
                            key={item.label} 
                            to={item.to} 
                            className="hover:text-black transition-colors duration-200"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4 flex-shrink-0">
                    {/* Localization Dropdown - Integrated Inline */}
                    <div className="relative settings-dropdown mr-2">
                        <button 
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className="flex items-center gap-1.5 group py-1"
                        >
                            <Globe className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                            <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-900">
                                {lang} · {currency}
                            </span>
                            <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${isSettingsOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isSettingsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute top-full right-0 mt-4 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 overflow-hidden z-[60]"
                                >
                                    {/* Language Section */}
                                    <div className="p-3 border-b border-gray-50">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t('common.language')}</p>
                                        <div className="space-y-1">
                                            {[
                                                { code: 'en', label: 'English' },
                                                { code: 'vi', label: 'Tiếng Việt' }
                                            ].map((l) => (
                                                <button
                                                    key={l.code}
                                                    onClick={() => { setLang(l.code); setIsSettingsOpen(false); }}
                                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${lang === l.code ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                                                >
                                                    {l.label}
                                                    {lang === l.code && <Check className="w-3 h-3" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Currency Section */}
                                    <div className="p-3">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t('common.currency')}</p>
                                        <div className="space-y-1">
                                            {[
                                                { code: 'USD', label: 'US Dollar ($)' },
                                                { code: 'VND', label: 'Vietnamese Dong (₫)' }
                                            ].map((c) => (
                                                <button
                                                    key={c.code}
                                                    onClick={() => { setCurrency(c.code); setIsSettingsOpen(false); }}
                                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${currency === c.code ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                                                >
                                                    {c.label}
                                                    {currency === c.code && <Check className="w-3 h-3" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    


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
                            <Link to="/profile" className="hidden md:block text-sm font-medium text-gray-600 ml-4 hover:text-black transition">
                                {t('nav.welcome')}, {user?.fullName?.split(' ')[0]}
                            </Link>
                            <Link to="/wishlist" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black transition">
                                <Heart className="w-4 h-4" />
                                {t('nav.wishlist')}
                            </Link>
                            <Link to="/orders" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black transition">
                                {t('nav.orders')}
                            </Link>
                            <Link to="/my-designs" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black transition">
                                My Designs
                            </Link>
                            <button
                                onClick={() => { logout(); navigate('/'); }}
                                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-red-600 transition"
                            >
                                <LogOut className="w-4 h-4" />
                                {t('nav.logout')}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hidden md:block text-sm font-medium text-gray-600 hover:text-black transition ml-4">{t('nav.login')}</Link>
                            <Link to="/register" className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
                                {t('nav.register')}
                            </Link>
                        </>
                    )}
                    <button className="md:hidden">
                        <Menu className="w-6 h-6 text-gray-900" />
                    </button>
                </div>
            </div>
            

        </nav>
    );
};

export default Navbar;

