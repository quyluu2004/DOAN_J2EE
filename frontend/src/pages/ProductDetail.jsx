import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { getWishlist, toggleWishlist } from '../services/wishlistService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import * as reviewService from '../services/reviewService';
import { Plus, Minus, MoveLeft, ShoppingBag, Star, Send, Heart, ShieldCheck, Truck, RotateCcw, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '../context/LocalizationContext';
import { SplitText, BlurText, Rotating3DCard, DecorativeOrb, GlassMorphCard, ReflectiveCard, ClassicPictureFrame } from '../components/ui/ReactBits';

// Star Rating Component
const StarRating = ({ rating, onRate, interactive = false, size = 18 }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        onClick={() => interactive && onRate?.(star)}
        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        disabled={!interactive}
      >
        <Star
          size={size}
          strokeWidth={1.5}
          className={`transition-colors ${star <= rating ? 'fill-[#c8a35a] text-[#c8a35a]' : 'text-[#d4c8b8]'}`}
        />
      </button>
    ))}
  </div>
);

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, text: '' });
  const [reviewLoading, setReviewLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { t, formatPrice } = useLocalization();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch Product first (Critical)
        const productData = await getProductById(id);
        setProduct(productData);
        
        // Auto-select first variant if available
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
        
        // Parallel non-critical fetches
        fetchReviews();
        
        // Wishlist fetch (Resilient)
        if (user) {
          try {
            const wishlist = await getWishlist();
            setInWishlist(wishlist.some(p => p.id === productData.id));
          } catch (wishError) {
            console.warn('Wishlist load failed, failing gracefully:', wishError);
          }
        }
      } catch (error) {
        console.error('Critical Error:', error);
        toast.error('Unable to retrieve this piece.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
    window.scrollTo(0, 0);
  }, [id, user]);

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getReviews(id);
      setReviews(data);
    } catch (error) {
      console.error('Lấy đánh giá thất bại:', error);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (newReview.rating === 0) {
      toast.error('Please select a rating.');
      return;
    }
    if (!newReview.text.trim()) {
      toast.error('Please write your thoughts.');
      return;
    }
    
    try {
      setLoading(true);
      const res = await reviewService.addReview(id, newReview.rating, newReview.text);
      setReviews(prev => [res, ...prev]);
      setNewReview({ rating: 0, text: '' });
      toast.success('Your review has been shared.');
    } catch (error) {
      toast.error(error.message || 'Gửi đánh giá thất bại');
    } finally {
      setLoading(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select a finish first.');
      return;
    }
    if (selectedVariant.stock <= 0) {
      toast.error('This variation is currently out of stock.');
      return;
    }
    addToCart(product.id, selectedVariant.id, quantity);
    toast.success(`${quantity}x ${product.name} (${selectedVariant.color}) added to your collection.`, {
      style: { background: '#703225', color: '#ffffff' }
    });
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Join us to curate your wishlist.');
      navigate('/login');
      return;
    }

    try {
      await toggleWishlist(product.id);
      setInWishlist(!inWishlist);
      toast.success(inWishlist ? 'Removed from collection' : 'Added to collection');
    } catch (error) {
      toast.error('Action interrupted.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffcf9] flex items-center justify-center">
         <motion.div 
           animate={{ rotate: 360 }} 
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           className="w-12 h-12 border-t-2 border-[#703225] rounded-full"
         />
      </div>
    );
  }

  if (!product) return (
    <div className="min-h-screen bg-[#fffcf9] flex flex-col items-center justify-center font-serif italic text-[#8d493a] gap-6">
      <p className="text-3xl">Piece not found.</p>
      <Link to="/shop" className="text-sm uppercase tracking-widest border-b border-current pb-1">Return to Shop</Link>
    </div>
  );

  const images = [
    (selectedVariant?.imageUrl || product.imageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80'),
    'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567016432779-094069811ea2?auto=format&fit=crop&q=80'
  ];

  return (
    <div className="min-h-screen bg-[#fffcf9] text-[#221a0c] selection:bg-[#703225] selection:text-white pb-32 overflow-hidden relative">
      
      {/* Dynamic Background Accents */}
      <DecorativeOrb size={600} top="-10%" right="-5%" color1="#fcecd5" color2="#703225" />
      <DecorativeOrb size={400} bottom="10%" left="-5%" color1="#dde6cc" color2="#c8a35a" delay={2} />

      {/* Navigation Breadcrumb */}
      <div className="pt-24 md:pt-32 px-6 lg:px-24 max-w-[1600px] mx-auto mb-12 relative z-10">
        <Link to="/shop" className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-[#53433f] hover:text-[#703225] transition-all duration-500">
          <motion.div whileHover={{ x: -10 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
            <MoveLeft size={16} strokeWidth={2.5} />
          </motion.div>
          {t('product.gallery.back')}
        </Link>
      </div>

      <main className="px-6 lg:px-24 max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-32 relative z-10">
        
        {/* Left: Interactive 3D Gallery */}
        <section className="w-full lg:w-3/5 space-y-8">
          <Rotating3DCard intensity={5} className="w-full aspect-[4/5] md:aspect-square group cursor-zoom-in">
             <ClassicPictureFrame className="h-full w-full">
               <div className="w-full h-full bg-white flex items-center justify-center relative">
                 <AnimatePresence mode="wait">
                   <motion.img 
                      key={activeImage}
                      src={images[activeImage]} 
                      alt={product.name} 
                      initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full object-contain mix-blend-multiply"
                   />
                 </AnimatePresence>
                 
                 {/* Fullscreen indicator */}
                 <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2 text-[9px] uppercase tracking-tighter text-[#86736f]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#703225] animate-pulse"></div>
                    {t('product.gallery.interactive')}
                 </div>
               </div>
             </ClassicPictureFrame>
          </Rotating3DCard>

          <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x">
            {images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(idx)}
                className={`w-24 h-32 md:w-32 md:h-40 shrink-0 transition-all duration-700 p-4 flex items-center justify-center rounded-sm snap-start ${activeImage === idx ? 'bg-[#f0e0ca]' : 'bg-white hover:bg-[#fff2e0] border border-transparent hover:border-[#fcecd5]'}`}
              >
                <img src={img} alt={`Thumbnail ${idx+1}`} className="w-full h-full object-contain mix-blend-multiply transform transition-transform group-hover:scale-110" />
              </button>
            ))}
          </div>
        </section>

        {/* Right: Editorial Product Details */}
        <section className="w-full lg:w-2/5 flex flex-col pt-4">
          <div className="lg:sticky lg:top-32 space-y-12">
            
            <header className="space-y-6">
              <BlurText text={product.category} className="text-[10px] text-[#703225] font-bold uppercase tracking-[0.4em] mb-4" />
              <div className="space-y-2">
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.03em] text-[#221a0c] break-words uppercase">
                   {product.name}
                </h1>
                <div className="flex items-center gap-4 pt-4">
                   <StarRating rating={Math.round(avgRating)} size={14} />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-[#86736f]">{reviews.length} {t('product.reviews')}</span>
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                className="font-serif italic text-4xl text-[#703225] pt-4"
              >
                {formatPrice(product.price)}
              </motion.div>
              {/* VIP Exclusive Badge */}
              {product.vipOnly && (
                <div className="flex items-center gap-2 pt-3">
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#c8a35a] to-[#e8c968] px-4 py-1.5 rounded-full">
                    <Crown size={14} className="text-[#221a0c]" />
                    <span className="text-[10px] font-black text-[#221a0c] uppercase tracking-wider">VIP Exclusive</span>
                  </div>
                </div>
              )}
            </header>

            <div className="space-y-6">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#53433f] flex items-center gap-4">
                   {t('product.finishes')} <div className="h-px flex-1 bg-[#221a0c]/10" />
                </span>
                <div className="flex flex-wrap gap-5">
                  {product.variants && product.variants.map((v) => (
                     <button 
                       key={v.id} 
                       onClick={() => setSelectedVariant(v)}
                       className="group relative flex flex-col items-center"
                     >
                        <motion.div 
                          whileHover={{ scale: 1.15 }}
                          className={`w-14 h-14 rounded-full shadow-lg shadow-black/5 cursor-pointer ring-offset-[#fffcf9] transition-all duration-500 ${selectedVariant?.id === v.id ? 'ring-2 ring-offset-4 ring-[#703225]' : 'hover:ring-1 hover:ring-offset-2 hover:ring-[#703225]/30'}`} 
                          style={{ backgroundColor: v.colorCode || v.color.toLowerCase() }}
                        />
                        <span className={`absolute -bottom-6 text-[8px] uppercase tracking-tighter transition-opacity duration-500 whitespace-nowrap ${selectedVariant?.id === v.id ? 'opacity-100 text-[#703225] font-black' : 'opacity-0 group-hover:opacity-100 text-[#86736f]'}`}>{v.color}</span>
                     </button>
                  ))}
                </div>
                
                {/* Stock Level Indicator */}
                {selectedVariant && (
                  <div className="pt-4 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${selectedVariant.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#86736f]">
                      {selectedVariant.stock > 0 
                        ? `${selectedVariant.stock} ${t('product.stock.available') || 'in stock'}`
                        : `${t('product.stock.outofstock') || 'Out of stock'}`
                      }
                    </span>
                  </div>
                )}
            </div>

            {/* Purchase Interaction Zone */}
            <div className="flex flex-col sm:flex-row items-stretch gap-4 pt-4">
               <div className="flex items-center justify-between border border-[#221a0c]/10 w-full sm:w-40 h-16 px-6 rounded-sm bg-white hover:border-[#703225] transition-colors duration-500 group">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-[#86736f] hover:text-[#703225] transition-all transform hover:scale-125"><Minus size={16} strokeWidth={2.5} /></button>
                  <span className="font-serif text-xl font-medium text-[#221a0c]">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="text-[#86736f] hover:text-[#703225] transition-all transform hover:scale-125"><Plus size={16} strokeWidth={2.5} /></button>
               </div>
               
                <motion.button 
                 whileHover={(selectedVariant?.stock > 0 && !(product.vipOnly && !user?.vip)) ? { y: -5, boxShadow: "0 20px 40px rgba(112,50,37,0.15)" } : {}}
                 whileTap={(selectedVariant?.stock > 0 && !(product.vipOnly && !user?.vip)) ? { scale: 0.98 } : {}}
                 onClick={product.vipOnly && !user?.vip ? () => navigate('/wallet') : handleAddToCart}
                 disabled={!selectedVariant || selectedVariant.stock <= 0}
                 className={`flex-1 rounded-sm h-16 uppercase tracking-[0.2em] text-[10px] font-black transition-all duration-700 flex justify-center items-center gap-4 px-8 ${
                    product.vipOnly && !user?.vip
                    ? 'bg-gradient-to-r from-[#c8a35a] to-[#e8c968] text-[#221a0c] cursor-pointer'
                    : !selectedVariant || selectedVariant.stock <= 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-[#221a0c] hover:bg-[#703225] text-white'
                 }`}
               >
                 {product.vipOnly && !user?.vip ? (
                   <><Crown size={15} strokeWidth={2.5} /> Upgrade to VIP to make purchases.</>
                 ) : (
                   <><ShoppingBag size={15} strokeWidth={2.5} /> {selectedVariant?.stock > 0 ? t('product.acquire') : t('product.stock.outofstock') || 'Out of stock'}</>
                 )}
               </motion.button>
               
               <button 
                 onClick={handleWishlistToggle}
                 className={`w-16 h-16 rounded-sm flex items-center justify-center transition-all duration-700 border ${
                   inWishlist 
                     ? 'bg-[#703225] text-white border-[#703225]' 
                     : 'bg-white text-[#221a0c] border-[#221a0c]/10 hover:border-[#703225] hover:text-[#703225]'
                 }`}
               >
                 <Heart size={20} fill={inWishlist ? "currentColor" : "none"} strokeWidth={1.5} className={inWishlist ? 'animate-bounce' : ''} />
               </button>
            </div>

            {/* Trust Seals & Support */}
            <div className="grid grid-cols-3 gap-6 pt-8 text-center border-t border-[#221a0c]/5">
               <div className="space-y-2">
                 <ShieldCheck className="mx-auto text-[#703225]/60" size={18} />
                 <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#86736f]">{t('product.trust.warranty')}</span>
               </div>
               <div className="space-y-2">
                 <Truck className="mx-auto text-[#703225]/60" size={18} />
                 <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#86736f]">{t('product.trust.delivery')}</span>
               </div>
               <div className="space-y-2">
                 <RotateCcw className="mx-auto text-[#703225]/60" size={18} />
                 <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#86736f]">{t('product.trust.returns')}</span>
               </div>
            </div>

            {/* Technical Specifications Overlay */}
            <GlassMorphCard className="p-10 rounded-sm">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#703225] mb-8 flex items-center justify-between">
                  {t('product.specs.title')} <span className="w-1.5 h-1.5 rounded-full bg-[#703225]"></span>
               </h4>
               <div className="text-sm leading-relaxed space-y-6 font-medium">
                  <div className="flex justify-between border-b border-[#221a0c]/5 pb-4">
                     <span className="text-[#86736f] text-[9px] uppercase tracking-wider">{t('product.specs.dimensions')}</span>
                     <span className="text-right text-[#221a0c] font-serif">{product.dimensions || 'W 240cm × D 105cm × H 75cm'}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#221a0c]/5 pb-4">
                     <span className="text-[#86736f] text-[9px] uppercase tracking-wider">{t('product.specs.materials')}</span>
                     <span className="text-right text-[#221a0c] font-serif">{product.material || 'Solid ash wood, Italian leather.'}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                     <span className="text-[#86736f] text-[9px] uppercase tracking-wider">{t('product.specs.provenance')}</span>
                     <span className="text-right text-[#221a0c] font-serif">{t('product.specs.provenance_val')}</span>
                  </div>
               </div>
            </GlassMorphCard>

          </div>
        </section>
      </main>

      {/* ═ Reviews - Full Width Narrative Section ═ */}
      <section className="mt-48 max-w-[1600px] mx-auto px-6 lg:px-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-8">
          <div className="max-w-xl">
             <BlurText text={t('product.reviews_narrative.title')} className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#703225] mb-6" />
             <h2 className="font-serif text-5xl md:text-7xl leading-[0.9] tracking-[-0.04em] text-[#221a0c] lowercase">
                {t('product.reviews_narrative.subtitle').replace('{{name}}', product.name)}
             </h2>
          </div>
          <GlassMorphCard className="px-12 py-8 rounded-sm flex items-center gap-10">
            <span className="font-serif text-7xl text-[#703225] font-light leading-none">{avgRating || "0.0"}</span>
            <div className="space-y-2">
              <StarRating rating={Math.round(avgRating)} size={22} />
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#86736f] opacity-60">
                {t('product.reviews_narrative.score').replace('{{count}}', reviews.length)}
              </p>
            </div>
          </GlassMorphCard>
        </div>

        {/* Reviews Horizontal Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {reviews.length > 0 ? reviews.map((review, index) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="group p-1 bg-gradient-to-br from-[#221a0c]/5 to-transparent rounded-sm"
            >
              <div className="bg-white h-full p-10 space-y-8 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-700 shadow-sm hover:shadow-2xl hover:shadow-[#703225]/5">
                <div>
                  <StarRating rating={review.rating} size={14} />
                  <p className="text-[#221a0c] text-lg leading-relaxed mt-10 font-serif italic font-light opacity-90 group-hover:opacity-100 transition-opacity">
                    "{review.comment}"
                  </p>
                </div>
                <div className="flex items-center justify-between pt-8 border-t border-[#221a0c]/5">
                  <span className="text-[9px] font-black text-[#221a0c] uppercase tracking-[0.3em]">{review.user?.fullName || 'Collector'}</span>
                  <span className="text-[8px] font-bold text-[#86736f] uppercase tracking-tighter">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-24 text-center border border-dashed border-[#221a0c]/10 rounded-sm">
               <p className="font-serif italic text-[#86736f] text-xl">{t('product.reviews_narrative.empty')}</p>
            </div>
          )}
        </div>

        {/* Curation Form - Glass Theme */}
        <div className="max-w-4xl mx-auto">
          <GlassMorphCard className="p-16 md:p-24 rounded-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#fcecd5]/30 rounded-full blur-[100px] -z-10" />
             <div className="relative z-10 max-w-lg">
                <h3 className="font-serif text-4xl mb-6 text-[#221a0c] leading-tight">{t('product.review_form.title')}</h3>
                <p className="text-[10px] text-[#86736f] mb-12 uppercase tracking-[0.3em] font-black leading-loose">
                  {isAuthenticated ? t('product.review_form.desc_auth') : t('product.review_form.desc_no_auth')}
                </p>

                {isAuthenticated ? (
                  <form onSubmit={handleSubmitReview} className="space-y-12">
                    <div className="space-y-4">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#703225] block">{t('product.review_form.intensity')}</label>
                      <StarRating rating={newReview.rating} onRate={(r) => setNewReview(p => ({ ...p, rating: r }))} interactive size={32} />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#703225] block">{t('product.review_form.narrative')}</label>
                      <textarea 
                        value={newReview.text}
                        onChange={(e) => setNewReview(p => ({ ...p, text: e.target.value }))}
                        rows={5}
                        placeholder={t('product.review_form.placeholder')}
                        className="w-full bg-white/50 backdrop-blur-sm border border-[#221a0c]/10 text-[#221a0c] p-6 rounded-sm text-base focus:outline-none focus:border-[#703225] transition-all duration-500 resize-none font-medium placeholder:text-[#b8a99a]"
                      />
                    </div>
                    <motion.button 
                      whileHover={{ x: 10 }}
                      type="submit" 
                      className="bg-[#221a0c] hover:bg-[#703225] text-white rounded-sm h-14 px-12 uppercase tracking-[0.3em] text-[10px] font-black transition-all duration-700 flex items-center gap-6 shadow-xl shadow-black/10"
                    >
                      {t('product.review_form.submit')}
                      <Send size={14} strokeWidth={2.5} />
                    </motion.button>
                  </form>
                ) : (
                  <Link 
                    to="/login" 
                    className="inline-flex items-center gap-6 bg-[#221a0c] hover:bg-[#703225] text-white rounded-sm h-14 px-12 uppercase tracking-[0.3em] text-[10px] font-black transition-all duration-700 shadow-xl shadow-black/10"
                  >
                    {t('product.review_form.authenticate')}
                    <MoveLeft className="rotate-180" size={16} strokeWidth={2.5} />
                  </Link>
                )}
             </div>
          </GlassMorphCard>
        </div>
      </section>
      
    </div>
  );
}
