import React, { useState, useEffect } from 'react';
import { getWishlist, toggleWishlist } from '../services/wishlistService';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { SplitText } from '../components/ui/ReactBits';

import { useLocalization } from '../context/LocalizationContext';

export default function Wishlist() {
  const { t } = useLocalization();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const data = await getWishlist();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      toast.error(t('wishlist.errors.load'));
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await toggleWishlist(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success(t('wishlist.success.remove'));
    } catch (error) {
      toast.error(t('wishlist.errors.remove'));
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product.id, 1);
    toast.success(t('wishlist.success.add_cart').replace('{{name}}', product.name));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff8f3] flex items-center justify-center animate-pulse">
         <div className="w-16 h-16 border-t-2 border-[#703225] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f3] text-[#221a0c] font-sans pb-32">
       {/* Background Atmosphere */}
       <div className="absolute top-0 right-0 w-1/2 h-96 bg-[#fcecd5] rounded-bl-[100px] -z-10 opacity-60"></div>

       <div className="pt-32 md:pt-40 px-6 md:px-12 max-w-[1440px] mx-auto mb-20">
          <SplitText 
            text={t('wishlist.title')} 
            className="font-serif text-5xl md:text-7xl tracking-[-0.02em] leading-none mb-4 text-[#703225] inline-block" 
          />
          <p className="font-serif italic text-[#86736f] text-lg">{t('wishlist.sub')}</p>
       </div>

       <div className="px-6 md:px-12 max-w-[1440px] mx-auto">
          {products.length === 0 ? (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="py-32 flex flex-col items-center justify-center bg-[#fff2e0] rounded-sm">
               <Heart size={48} className="text-[#d4c8b8] mb-6" />
               <p className="text-[#703225] text-xl font-serif italic mb-6">{t('wishlist.empty')}</p>
               <Link to="/shop" className="text-xs uppercase font-bold tracking-[0.1em] bg-[#703225] text-white px-8 py-3 rounded-sm hover:bg-[#8d493a] transition-colors">{t('wishlist.cta')}</Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
               {products.map((product) => (
                  <motion.div 
                    key={product.id}
                    layout
                    initial={{ opacity:0, scale:0.95 }}
                    animate={{ opacity:1, scale:1 }}
                    exit={{ opacity:0, scale:0.95 }}
                    className="bg-white/40 backdrop-blur-sm p-6 rounded-sm border border-[#fcecd5] group relative hover:shadow-xl transition-all duration-500"
                  >
                     <Link to={`/products/${product.id}`} className="block aspect-[4/5] bg-[#fff2e0] mb-6 overflow-hidden rounded-sm flex items-center justify-center p-4">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
                        />
                     </Link>
                     <div className="text-center">
                        <span className="text-[9px] uppercase tracking-widest text-[#86736f] block mb-2">{product.category}</span>
                        <h3 className="font-serif text-lg mb-2 text-[#221a0c]">{product.name}</h3>
                        <p className="text-[#703225] font-medium mb-6">${product.price.toLocaleString()}</p>
                        
                        <div className="flex gap-2">
                           <button 
                             onClick={() => handleAddToCart(product)}
                             className="flex-1 bg-black text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black/80 transition-all flex items-center justify-center gap-2"
                           >
                              <ShoppingBag size={14} /> {t('wishlist.add_to_bag')}
                           </button>
                           <button 
                             onClick={() => removeFromWishlist(product.id)}
                             className="w-12 h-12 flex items-center justify-center text-[#86736f] hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100 rounded-sm"
                             title={t('wishlist.remove_tooltip')}
                           >
                              <Trash2 size={18} />
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
          )}
       </div>
    </div>
  );
}
