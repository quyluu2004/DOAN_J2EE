import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, ChevronRight, ChevronLeft, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import { useCart } from '@/context/CartContext';
import { useLocalization } from '../context/LocalizationContext';

import MiniRoom3D from '../components/MiniRoom3D';
import { SplitText } from '@/components/ui/ReactBits';

const HomePage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [products, setProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const { addToCart } = useCart();
    const { t, formatPrice } = useLocalization();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        // Fetch products for best sellers
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data.slice(0, 4)))
            .catch(err => console.error(err));

        // Fetch exactly 3 featured products for Hero
        fetch('/api/products?size=3')
            .then(res => res.json())
            .then(data => {
                const items = Array.isArray(data) ? data : (data.content || []);
                setFeaturedProducts(items.slice(0, 3));
            })
            .catch(err => console.error(err));

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAddToCart = (productId) => {
        addToCart(productId, 1);
    };

    return (
        <div className="font-['Plus_Jakarta_Sans'] bg-[#F5F5F7] min-h-screen text-gray-900 selection:bg-black selection:text-white">
            {/* 2. HERO SECTION */}
            <Hero featuredProducts={featuredProducts} />

            {/* 3. CURATED COLLECTIONS */}
            <section className="py-20 max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">{t('home.curated_title')}</h2>
                    <Link to="/shop" className="hidden md:flex items-center gap-2 text-sm font-medium border-b border-black pb-0.5 hover:text-gray-600 transition">
                        {t('home.curated.view_all')} <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[600px]">

                    {/* Item 1: Living Room (Big) */}
                    <Link to="/shop?category=Living Room" className="col-span-1 md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2rem] cursor-pointer block">
                        <img
                            src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1000"
                            alt="Living Room"
                            className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                        <div className="absolute bottom-8 left-8 text-white">
                            <h3 className="text-2xl font-bold mb-1">{t('home.curated.living_room')}</h3>
                            <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full text-xs font-semibold group-hover:bg-white group-hover:text-black transition">
                                {t('home.curated.explore')}
                            </span>
                        </div>
                    </Link>

                    {/* Item 2: Dining */}
                    <Link to="/shop?category=Dining" className="col-span-1 md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-[2rem] cursor-pointer block">
                        <img
                            src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800"
                            alt="Dining"
                            className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <h3 className="text-xl font-bold">{t('home.curated.dining')}</h3>
                        </div>
                    </Link>

                    {/* Item 3: Bedroom */}
                    <Link to="/shop?category=Bedroom" className="col-span-1 md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-[2rem] cursor-pointer block">
                        <img
                            src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800"
                            alt="Bedroom"
                            className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <h3 className="text-xl font-bold">{t('home.curated.bedroom')}</h3>
                        </div>
                    </Link>

                </div>
            </section>

            {/* 4. BEST SELLERS */}
            <section className="py-20 bg-white rounded-t-[3rem] mt-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-bold uppercase tracking-tight">{t('home.best_sellers')}</h2>
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
                                <Link to={`/products/${product.id}`} key={product.id} className="group cursor-pointer block">
                                    <div className="bg-[#F5F5F7] rounded-3xl p-8 mb-4 relative h-[350px] flex items-center justify-center">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition duration-500"
                                        />
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(product.id); }}
                                            className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors duration-300"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{product.name}</h3>
                                        <p className="text-gray-500 font-medium">{formatPrice(product.price)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* 5. 3D STUDIO BANNER */}
            <section className="bg-[#111827] text-white py-0 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[600px]">
                    <div className="py-12 z-10">
                        <span className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-4 block">
                            {t('home.studio.sub')}
                        </span>
                        
                        <SplitText 
                            text={t('home.studio.title')} 
                            className="text-5xl font-bold mb-8 leading-tight text-white"
                        />
                        
                        <p className="text-gray-400 mb-10 max-w-md text-lg leading-relaxed">
                            {t('home.studio.desc')}
                        </p>
                        
                        <button 
                            onClick={() => navigate('/3d-designer')}
                            className="bg-white text-black px-10 py-4 rounded-full text-sm font-bold hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 duration-200"
                        >
                            {t('home.studio.cta')}
                        </button>
                    </div>

                    <div className="relative h-full min-h-[400px] md:min-h-[600px] flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-transparent to-transparent z-10 pointer-events-none" />
                        <MiniRoom3D />
                    </div>
                </div>
            </section>

            {/* FOOTER (Simple) */}
            <footer className="bg-[#111827] text-white py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; 2026 ÉLITAN. {t('footer.rights')}</p>
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
