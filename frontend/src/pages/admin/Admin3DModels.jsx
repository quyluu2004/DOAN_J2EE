import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { X, Image as ImageIcon, Box, Upload, CheckCircle, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SplitText, SpotlightCard } from '../../components/ui/ReactBits';

export default function Admin3DModels() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [glbFile, setGlbFile] = useState(null);
  
  const [lang, setLang] = useState('vi'); // Default to Vietnamese
  const [showImport3D, setShowImport3D] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const import3DInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    glbUrl: '',
    glbName: '',
    imageUrl: ''
  });

  const fetchProducts = async () => {
    try {
      // Bypassing cache to ensure latest state
      const res = await axios.get(`/api/products?_t=${new Date().getTime()}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product) => {
    setEditProduct(product);
    setFormData({ 
      glbUrl: product.glbUrl || '',
      glbName: product.glbName || '',
      imageUrl: product.imageUrl || ''
    });
    setGlbFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditProduct(null);
    setGlbFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      let finalGlbUrl = formData.glbUrl;
      
      // Upload glb file if selected
      if (glbFile) {
        const glbUploadData = new FormData();
        glbUploadData.append('files', glbFile);
        const glbRes = await axios.post('/api/upload', glbUploadData, config);
        if (glbRes.data.length > 0) finalGlbUrl = glbRes.data[0];
      }
      
      // We only update visual info on the existing product
      const payload = { 
        ...editProduct, 
        glbUrl: finalGlbUrl,
        glbName: formData.glbName,
        imageUrl: formData.imageUrl
      };

      await axios.put(`/api/products/${editProduct.id}`, payload, config);
      toast.success(lang === 'vi' ? "Mô hình 3D đã cập nhật thành công!" : "3D Model updated successfully!");
      
      handleCloseModal();
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Operation failed");
    }
  };

  const handleRemove3D = async (product) => {
    if (!window.confirm(lang === 'vi' ? 'Bạn có chắc chắn muốn gỡ bỏ link mô hình 3D khỏi sản phẩm này?' : 'Are you sure you want to remove the 3D model link from this product?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const payload = { ...product, glbUrl: null, glbName: null }; // Set both to null

      await axios.put(`/api/products/${product.id}`, payload, config);
      toast.success(lang === 'vi' ? "Đã gỡ mô hình 3D thành công!" : "3D Model removed successfully!");
      
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Operation failed");
    }
  };

  const handleImport3DFile = async (file) => {
    if (!file) return;
    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/admin/import-3d', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      toast.success(lang === 'vi' ? `Cập nhật thành công ${res.data.successRows} mô hình 3D!` : `Success: ${res.data.successRows} 3D models updated!`);
      if (res.data.failedRows > 0) {
        toast.warning(`${res.data.failedRows} mục bị lỗi, kiểm tra Console.`);
        console.error("3D Import Errors:", res.data.errors);
      }
      setIsImporting(false);
      setShowImport3D(false);
      fetchProducts();
    } catch (err) {
      setIsImporting(false);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Import 3D failed';
      toast.error(`Lỗi: ${errorMsg}`);
    }
  };

  return (
    <div className="w-full pb-20">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 mt-8">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-[#006030] text-xs tracking-[0.3em] font-semibold uppercase mb-4"
          >
            {lang === 'vi' ? 'Quản lý 3D' : '3D Assets'}
          </motion.p>
          <h1 className="text-5xl font-serif tracking-wide text-[#121212]">
            <SplitText text={lang === 'vi' ? 'Mô Hình 3D' : '3D Models'} />
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            onClick={() => setLang(lang === 'en' ? 'vi' : 'en')}
            className="flex items-center justify-center w-12 h-12 border border-[#e2e2e2] bg-[#f9f9f9] text-[#131313] hover:border-[#131313] transition-colors"
            title="Đổi ngôn ngữ | Switch Language"
          >
            <span className="font-bold text-xs">{lang === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowImport3D(!showImport3D)}
            className="flex items-center space-x-3 border border-[#006030] bg-[#006030] text-white px-6 py-4 rounded-none hover:bg-[#004d26] transition-colors relative"
          >
            <Box className="w-4 h-4" />
            <span className="font-semibold text-[0.65rem] tracking-widest uppercase">{lang === 'vi' ? 'Nhập Hàng Loạt (.xlsx)' : 'Bulk Import 3D'}</span>
          </motion.button>
        </div>
      </div>

      {/* ===== 3D IMPORT ZONE ===== */}
      <AnimatePresence>
        {showImport3D && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-10 overflow-hidden"
          >
            <div
              onClick={() => !isImporting && import3DInputRef.current?.click()}
              className="relative border-2 border-dashed border-[#006030] bg-[#f0fdf4] hover:bg-[#dcfce7] p-12 text-center cursor-pointer transition-all duration-300"
            >
              <input
                ref={import3DInputRef}
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={(e) => handleImport3DFile(e.target.files[0])}
              />
              {isImporting ? (
                 <div className="flex flex-col items-center space-y-4">
                   <Loader2 className="w-10 h-10 text-[#006030] animate-spin" />
                   <p className="text-sm font-semibold text-[#006030]">{lang === 'vi' ? 'Đang xử lý...' : 'Processing...'}</p>
                 </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <Box className="w-12 h-12 text-[#006030]" />
                  <div>
                  <p className="text-lg font-serif text-[#006030] mb-1">{lang === 'vi' ? 'Nhấn để Tải lên File Excel Bản Đồ 3D (.xlsx)' : 'Drop 3D Excel Routing File (.xlsx)'}</p>
                  <p className="text-[0.65rem] uppercase tracking-widest text-[#006030] opacity-80 mt-2 leading-relaxed">
                    {lang === 'vi' ? 'CHÚ Ý: Chỉ dùng để dán link 3D/Ảnh vào SẢN PHẨM CÓ SẴN (Cột A: ID)\nCột B: Link GLB — Cột C: Tên Model 3D — Cột D: Link Ảnh URL' : 'A: ID — B: GLB Link — C: Model Name — D: Image URL'}
                  </p>
                </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Layout for Products */}
      {loading ? (
        <div className="text-center py-20 text-[#777777] animate-pulse uppercase tracking-widest text-xs">Loading 3D Assets...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-[#777777] uppercase tracking-widest text-xs">No products found.</div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial="hidden" animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
          }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
              }}
            >
              <SpotlightCard className={`h-full group cursor-pointer border ${product.glbUrl ? 'border-[#006030]/20' : 'border-transparent'}`} onClick={() => handleOpenModal(product)}>
                <div className="relative aspect-square w-full overflow-hidden bg-[#f3f3f3]">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#c6c6c6]">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                  {/* Status Indicator */}
                  <div className={`absolute top-4 left-4 backdrop-blur-md px-3 py-1 text-[0.6rem] tracking-widest uppercase font-bold flex items-center gap-2 ${product.glbUrl ? 'bg-[#006030]/90 text-white' : 'bg-black/50 text-white'}`}>
                    {product.glbUrl ? (
                      <><CheckCircle className="w-3 h-3" /> {lang === 'vi' ? 'Đã có 3D' : '3D Ready'}</>
                    ) : (
                      <><AlertCircle className="w-3 h-3 text-[#ffc107]" /> {lang === 'vi' ? 'Thiếu 3D' : 'Missing 3D'}</>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 px-2 text-[0.6rem] font-bold text-black border border-black/10">
                    ID: {product.id}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow justify-between bg-white z-10">
                  <div>
                    <h3 className="font-serif text-lg text-[#1a1c1c] mb-1 group-hover:text-[#006030] transition-colors line-clamp-1">{product.name}</h3>
                    {product.glbName ? (
                      <p className="text-xs font-bold text-[#006030] mb-1 flex items-center gap-1"><Box className="w-3 h-3" /> {product.glbName}</p>
                    ) : null}
                    <p className="text-[0.65rem] text-[#777777] break-all line-clamp-1 h-4">
                       {product.glbUrl || (lang === 'vi' ? 'Chưa có link .glb' : 'No .glb link integrated')}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-5 border-t border-[#f3f3f3] mt-4">
                    <span className="text-[#006030] text-[0.65rem] tracking-widest uppercase font-bold transition-colors">
                      {lang === 'vi' ? (product.glbUrl ? 'Đổi Mô Hình' : 'Gắn Mô Hình') : (product.glbUrl ? 'Change Model' : 'Assign Model')}
                    </span>
                    {product.glbUrl && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRemove3D(product); }}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-colors"
                        title={lang === 'vi' ? 'Xóa file 3D' : 'Remove 3D File'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && editProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-[#131313]/80 backdrop-blur-sm" onClick={handleCloseModal}></div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white border border-[#006030] p-10 overflow-hidden shadow-2xl"
            >
              <button type="button" onClick={handleCloseModal} className="absolute top-6 right-6 text-[#777777] hover:text-[#1a1c1c] z-10">
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Box className="w-6 h-6 text-[#006030]" />
                  <h2 className="text-2xl font-serif text-[#006030]">Quản lý 3D</h2>
                </div>
                <p className="text-sm font-bold text-[#131313] mb-8 pb-4 border-b border-[#e2e2e2]">
                  [{editProduct.id}] {editProduct.name}
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[0.65rem] font-bold tracking-[0.2em] text-[#777777] uppercase mb-4">Tải Lên File 3D (.glb)</label>
                    <div className="relative border-2 border-dashed border-[#006030]/20 hover:border-[#006030] bg-[#fdfdfd] hover:bg-[#f2fcf6] transition-all p-6 flex flex-col items-center justify-center cursor-pointer group h-32">
                      <input type="file" accept=".glb" onChange={(e) => setGlbFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <Upload className="w-6 h-6 text-[#006030] opacity-50 group-hover:opacity-100 transition-opacity mb-2" />
                      <p className="text-[0.65rem] font-bold uppercase tracking-widest text-[#006030] text-center">
                        {glbFile ? glbFile.name : "Kéo thả file .glb vào đây"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                     <span className="w-full h-px bg-[#e2e2e2]"></span>
                     <span className="text-[0.65rem] font-bold text-[#aaaaaa] uppercase tracking-[0.2em]">Hoặc</span>
                     <span className="w-full h-px bg-[#e2e2e2]"></span>
                  </div>

                  <div className="group">
                    <label className="block text-[0.65rem] font-bold tracking-[0.2em] text-[#777777] uppercase mb-2">Tên Mô Hình 3D (Tùy chọn)</label>
                    <input name="glbName" value={formData.glbName} onChange={(e) => setFormData({...formData, glbName: e.target.value})} className="w-full bg-transparent border-b border-[#e2e2e2] focus:border-[#006030] outline-none py-3 text-sm transition-all focus:bg-[#f9f9f9] px-3 font-medium text-[#131313]" placeholder="Ví dụ: Đèn Trần 1..." />
                  </div>

                  <div className="group">
                    <label className="block text-[0.65rem] font-bold tracking-[0.2em] text-[#777777] uppercase mb-2">Link Ảnh Bìa (Tùy chọn)</label>
                    <input name="imageUrl" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-transparent border-b border-[#e2e2e2] focus:border-[#006030] outline-none py-3 text-sm transition-all focus:bg-[#f9f9f9] px-3 font-mono text-[#131313]" placeholder="https://..." />
                  </div>

                  <div className="group">
                    <label className="block text-[0.65rem] font-bold tracking-[0.2em] text-[#777777] uppercase mb-2">Link 3D .glb (Cloudinary/Github)</label>
                    <input name="glbUrl" value={formData.glbUrl} onChange={(e) => setFormData({...formData, glbUrl: e.target.value})} className="w-full bg-transparent border-b border-[#e2e2e2] focus:border-[#006030] outline-none py-3 text-sm transition-all focus:bg-[#f9f9f9] px-3 font-mono text-[#131313]" placeholder="https://..." />
                  </div>
                  
                  <div className="pt-6 flex justify-end space-x-3 mt-4">
                    <button type="button" onClick={handleCloseModal} className="px-6 py-3 text-xs font-bold tracking-widest uppercase text-[#777777] hover:text-[#131313] hover:bg-[#f9f9f9] transition-colors">HỦY</button>
                    <button type="submit" className="px-6 py-3 bg-[#006030] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#004d26] transition-colors">LƯU MÔ HÌNH</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
