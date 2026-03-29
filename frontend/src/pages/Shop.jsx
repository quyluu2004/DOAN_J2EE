import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { getWishlist, toggleWishlist } from '../services/wishlistService';
import { getAllCollections } from '../services/collectionService';
import { getAllColors } from '../services/colorService';
import { getAllMaterials } from '../services/materialService';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Camera } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { SplitText, SpotlightCard } from '../components/ui/ReactBits';
import { useLocalization } from '../context/LocalizationContext';


export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlistIds, setWishlistIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);

  
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { t, formatPrice } = useLocalization();
  
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get('page') || '0', 10);
  const categoryFilter = searchParams.get('category') || '';
  const searchFilter = searchParams.get('search') || '';
  const materialFilter = searchParams.get('material') || '';
  const colorFilter = searchParams.get('color') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchFilters();
    if (user) {
      fetchWishlist();
    }
    setSearchTerm(searchFilter);
  }, [location.search, user]);

  const fetchFilters = async () => {
    try {
      const [colorsData, materialsData] = await Promise.all([
        getAllColors(),
        getAllMaterials()
      ]);
      setAvailableColors(colorsData);
      setAvailableMaterials(materialsData);
    } catch (error) {
      console.error('Failed to load filters:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCollections();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const wishlist = await getWishlist();
      setWishlistIds(wishlist.map(p => p.id));
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts({
        page: currentPage,
        size: 12,
        category: categoryFilter,
        name: searchFilter,
        material: materialFilter,
        color: colorFilter,
        minPrice: minPrice,
        maxPrice: maxPrice,
        sortBy: 'id',
        direction: 'desc'
      });
      setProducts(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (key, value) => {
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') {
      params.set('page', '0');
    }
    navigate(`?${params.toString()}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters('search', searchTerm);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  const handleWishlistToggle = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Vui lòng đăng nhập để yêu thích sản phẩm');
      navigate('/login');
      return;
    }

    try {
      await toggleWishlist(productId);
      setWishlistIds(prev => 
        prev.includes(productId) 
          ? prev.filter(id => id !== productId) 
          : [...prev, productId]
      );
      toast.success(
        wishlistIds.includes(productId) 
          ? 'Đã xóa khỏi danh sách yêu thích' 
          : 'Đã thêm vào danh sách yêu thích'
      );
    } catch (error) {
      toast.error('Thao tác thất bại');
    }
  };

  const categoriesList = [
    { key: 'all', value: 'All' },
    ...categories.map(c => ({ key: c.name.toLowerCase().replace(/\s+/g, '_'), value: c.name }))
  ];
  
  const materialsList = availableMaterials.map(m => ({ 
    key: m.name.toLowerCase().replace(/\s+/g, '_'), 
    value: m.name 
  }));

  const colorsList = availableColors.map(c => ({ 
    key: c.name.toLowerCase().replace(/\s+/g, '_'), 
    value: c.name,
    hex: c.hexCode
  }));

  return (
    <div className="min-h-screen bg-[#fff8f3] text-[#221a0c] font-sans pb-32">
      
      {/* Header: Warm, Colorful Tuscan Atelier approach - Less Text, More Impact */}
      <div className="relative pt-32 md:pt-40 pb-12 mb-12">
        {/* Soft background color block for visual interest */}
        <div className="absolute top-0 right-0 w-2/3 md:w-1/2 h-full bg-[#fcecd5] rounded-bl-[100px] -z-10"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#dde6cc] rounded-full blur-3xl opacity-50 -z-10"></div>

        <div className="px-6 md:px-12 max-w-[1440px] mx-auto">
          <SplitText 
            text={t('shop.title')} 
            className="font-serif text-5xl md:text-[80px] lg:text-[100px] tracking-[-0.02em] leading-none mb-4 text-[#703225] inline-block" 
          />
        </div>
      </div>

      <div className="px-6 md:px-12 max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-14 relative">
        
        {/* Editorial Sidebar */}
        <div className="w-full lg:w-1/4 xl:w-1/5 space-y-10 shrink-0 lg:sticky lg:top-32 self-start pb-20">
          
          {/* Search */}
          <form onSubmit={handleSearch} className="relative group">
            <input 
              type="text" 
              placeholder={t('shop.search')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#fcecd5] text-[#221a0c] py-3 pl-4 pr-20 text-xs font-bold tracking-[0.1em] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#703225] transition-all placeholder:text-[#86736f]"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button type="submit" className="p-2 text-[#703225] hover:text-[#3a0a03] transition-colors">
                <Search size={16} strokeWidth={1.5} />
              </button>
            </div>
          </form>

          {/* Price Range */}
          <div className="bg-[#fff2e0] p-6 rounded-sm">
            <h3 className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#703225] mb-6 flex items-center gap-2">
              <span className="w-3 h-3 bg-[#703225] inline-block rounded-sm"></span> {t('shop.price_range')}
            </h3>
            <div className="flex gap-4 items-center">
              <input 
                type="number" 
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateFilters('minPrice', e.target.value)}
                className="w-full bg-[#fcecd5] text-[10px] py-2 px-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#703225]"
              />
              <span className="text-[#86736f]">-</span>
              <input 
                type="number" 
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateFilters('maxPrice', e.target.value)}
                className="w-full bg-[#fcecd5] text-[10px] py-2 px-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#703225]"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-[#fff2e0] p-6 rounded-sm">
            <h3 className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#703225] mb-6 flex items-center gap-2">
              <span className="w-3 h-3 bg-[#703225] inline-block rounded-sm"></span> {t('shop.category')}
            </h3>
            <ul className="space-y-4 text-xs text-[#53433f]">
              {categoriesList.map(cat => (
                <li key={cat.value}>
                  <button 
                    onClick={() => updateFilters('category', cat.value === 'All' ? '' : cat.value)}
                    className={`hover:text-[#703225] transition-all flex items-center justify-between w-full text-left font-medium ${
                      (categoryFilter === cat.value || (cat.value === 'All' && !categoryFilter)) ? 'text-[#703225]' : ''
                    }`}
                  >
                    {cat.key === 'all' ? t(`shop.categories.${cat.key}`) : cat.value}
                    {(categoryFilter === cat.value || (cat.value === 'All' && !categoryFilter)) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#703225]"></span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Materials */}
          <div className="bg-[#fcecd5] p-6 rounded-sm">
            <h3 className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#703225] mb-6 flex items-center gap-2">
              <span className="w-3 h-3 bg-[#703225] inline-block rounded-sm"></span> {t('shop.material')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {materialsList.map(mat => (
                <button
                  key={mat.value}
                  onClick={() => updateFilters('material', materialFilter === mat.value ? '' : mat.value)}
                  className={`text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${
                    materialFilter === mat.value 
                      ? 'bg-[#703225] text-white border-[#703225]' 
                      : 'border-[#703225]/20 text-[#703225] hover:border-[#703225]'
                  }`}
                >
                  {t(`shop.materials.${mat.key}`) !== `shop.materials.${mat.key}` ? t(`shop.materials.${mat.key}`) : mat.value}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="bg-[#dde6cc]/30 p-6 rounded-sm">
            <h3 className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#703225] mb-6 flex items-center gap-2">
              <span className="w-3 h-3 bg-[#703225] inline-block rounded-sm"></span> {t('shop.palette')}
            </h3>
            <div className="flex flex-wrap gap-3">
              {colorsList.map(color => (
                <button
                  key={color.value}
                  onClick={() => updateFilters('color', colorFilter === color.value ? '' : color.value)}
                  title={t(`shop.colors.${color.key}`)}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    colorFilter === color.value 
                      ? 'ring-2 ring-offset-2 ring-[#703225] scale-110' 
                      : 'border-black/10'
                  }`}
                  style={{ 
                    backgroundColor: color.hex || color.value.toLowerCase() 
                  }}
                />
              ))}
            </div>
          </div>

          {/* Reset Filters */}
          <button 
            onClick={() => navigate('/shop')}
            className="w-full text-center text-[10px] uppercase tracking-[0.2em] font-bold text-[#86736f] hover:text-[#703225] transition-colors py-4"
          >
            {t('shop.clear_all')}
          </button>
        </div>

        {/* Asymmetrical Product Grid View - Image Focus */}
        <div className="w-full lg:w-3/4 xl:w-4/5 pt-4">
          
          <div className="flex justify-between items-end mb-12">
             <span className="text-xs font-serif italic text-[#86736f]">
               {totalElements} {t('shop.items_found')}
             </span>
             <button className="text-[11px] uppercase font-bold tracking-[0.1em] text-[#703225] hover:text-[#3a0a03] transition-colors">
               {t('shop.sort')}
             </button>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="aspect-[3/4] bg-[#fff2e0] rounded-sm"></div>
                ))}
             </div>
          ) : products.length === 0 ? (
             <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="py-32 flex flex-col items-center justify-center bg-[#fff2e0] rounded-sm">
               <p className="text-[#703225] text-xl font-serif italic mb-6">{t('shop.no_results') || 'No pieces match your search.'}</p>
               <button onClick={() => navigate('/shop')} className="text-xs uppercase font-bold tracking-[0.1em] bg-[#703225] text-white px-8 py-3 rounded-sm hover:bg-[#8d493a] transition-colors">{t('shop.categories.all')}</button>
             </motion.div>
          ) : (
            <>
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16"
                initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {products.map((product, index) => (
                  <motion.div 
                    key={product.id} 
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                    className={`${index % 3 === 1 ? 'lg:mt-12' : ''}`} // Intentional asymmetry
                  >
                    <SpotlightCard className="h-full bg-[#fff8f3] shadow-none hover:shadow-[0_20px_40px_rgba(112,50,37,0.06)] group cursor-pointer border border-transparent hover:border-[#fcecd5] transition-all duration-500 rounded-sm p-4">
                      <Link to={`/products/${product.id}`} className="block h-full flex flex-col">
                        <div className="aspect-[4/5] bg-[#fff2e0] mb-6 relative overflow-hidden flex items-center justify-center rounded-sm">
                           <img 
                             src={product.imageUrl} 
                             alt={product.name}
                             className="w-full h-[85%] object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                           />
                           
                           {/* Wishlist Toggle */}
                           <button 
                             onClick={(e) => handleWishlistToggle(e, product.id)}
                             className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md z-30 ${
                                wishlistIds.includes(product.id)
                                  ? 'bg-[#703225] text-white'
                                  : 'bg-white/40 text-[#703225] hover:bg-white/60'
                             }`}
                           >
                              <Heart size={16} fill={wishlistIds.includes(product.id) ? "currentColor" : "none"} />
                           </button>

                           {/* Highlight Add to Cart */}
                           <button 
                             onClick={(e) => handleAddToCart(e, product)}
                             className="absolute bottom-4 right-4 w-10 h-10 bg-[#703225] text-white rounded-sm flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#8d493a] shadow-lg"
                           >
                              <ShoppingBag size={16} strokeWidth={2} />
                           </button>
                        </div>
                        <div className="flex-1 flex flex-col items-center text-center">
                          <h3 className="font-serif text-xl mb-2 text-[#221a0c]">{product.name}</h3>
                          <p className="text-sm font-medium text-[#703225]">{formatPrice(product.price)}</p>
                        </div>
                      </Link>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </motion.div>

              {/* Minimalist Pagination */}
              {totalPages > 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity:1 }} transition={{ delay: 0.4 }} className="mt-24 flex justify-center items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#53433f]">
                  <button 
                    disabled={currentPage === 0}
                    onClick={() => updateFilters('page', (currentPage - 1).toString())}
                    className="disabled:opacity-30 hover:text-[#703225] transition-colors mr-4"
                  >
                    {t('common.prev') || 'Prev'}
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => updateFilters('page', i.toString())}
                      className={`w-8 h-8 rounded-sm flex items-center justify-center transition-all ${
                        currentPage === i 
                          ? 'bg-[#703225] text-white' 
                          : 'hover:bg-[#fcecd5] text-[#221a0c]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    disabled={currentPage === totalPages - 1}
                    onClick={() => updateFilters('page', (currentPage + 1).toString())}
                    className="disabled:opacity-30 hover:text-[#703225] transition-colors ml-4"
                  >
                    {t('common.next') || 'Next'}
                  </button>
                </motion.div>
              )}
            </>
          )}

        </div>
      </div>

    </div>
  );
}
