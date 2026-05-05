import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, X, Image as ImageIcon, Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Box, Eye, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SplitText, SpotlightCard } from '../../components/ui/ReactBits';
import { getAllCollections } from '../../services/collectionService';
import { getAllColors } from '../../services/colorService';
import { getAllMaterials } from '../../services/materialService';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center } from '@react-three/drei';

/* ── Inline GLB Preview Component ── */
function GlbModel({ url }) {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene.clone()} />
    </Center>
  );
}

function GlbPreviewCanvas({ url }) {
  return (
    <div className="relative w-full h-48 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded overflow-hidden border border-[#e2e2e2]">
      <Canvas camera={{ position: [0, 1, 3], fov: 45 }} style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <GlbModel url={url} />
          <Environment preset="apartment" />
        </Suspense>
        <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={true} enablePan={false} />
      </Canvas>
      {/* Overlay hint */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white/70 text-[0.55rem] uppercase tracking-widest px-2 py-1 rounded pointer-events-none">
        <RotateCw className="w-3 h-3" /> 3D Preview
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [glbPreviewUrl, setGlbPreviewUrl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [glbFile, setGlbFile] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  // Import state
  const [showImport, setShowImport] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [importStatus, setImportStatus] = useState(null); // { status, totalRows, successRows, failedRows, errorLog }
  const [isImporting, setIsImporting] = useState(false);
  const importInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', stock: '', imageUrl: '', additionalImages: [], glbUrl: '', description: '', color: '', material: '', dimensions: '',
    variants: []
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
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
    fetchCategories();
    fetchColorsAndMaterials();
  }, []);

  const fetchColorsAndMaterials = async () => {
    try {
      const [colorsData, materialsData] = await Promise.all([
        getAllColors(),
        getAllMaterials()
      ]);
      setAvailableColors(colorsData);
      setAvailableMaterials(materialsData);
    } catch (error) {
      console.error('Failed to load filter data:', error);
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

  // Generate object URLs for image previews
  const imagePreviews = useMemo(() => {
    if (!selectedFiles || selectedFiles.length === 0) return [];
    return Array.from(selectedFiles).map(f => ({
      name: f.name,
      url: URL.createObjectURL(f),
      size: (f.size / 1024).toFixed(1)
    }));
  }, [selectedFiles]);

  // Cleanup object URLs on change
  useEffect(() => {
    return () => {
      imagePreviews.forEach(p => URL.revokeObjectURL(p.url));
    };
  }, [imagePreviews]);

  // Generate GLB preview URL
  useEffect(() => {
    if (glbFile) {
      const url = URL.createObjectURL(glbFile);
      setGlbPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setGlbPreviewUrl(null);
    }
  }, [glbFile]);

  const handleOpenModal = (product = null) => {
    setSelectedFiles([]);
    if (product) {
      setEditProduct(product);
      setFormData({ ...product, additionalImages: product.additionalImages || [], variants: product.variants || [] });
    } else {
      setEditProduct(null);
      setFormData({ 
        name: '', category: '', price: '', stock: '', imageUrl: '', additionalImages: [], glbUrl: '', description: '', color: '', material: '', dimensions: '',
        variants: []
      });
    }
    setGlbFile(null);
    setGlbPreviewUrl(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditProduct(null);
    setSelectedFiles([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setFormData(prev => ({ ...prev, variants: updatedVariants }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { color: '', colorCode: '', stock: 0, imageUrl: '' }]
    }));
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      let finalImageUrl = formData.imageUrl;
      let finalAdditionalImages = formData.additionalImages || [];

      if (selectedFiles.length > 0) {
        const uploadData = new FormData();
        Array.from(selectedFiles).forEach(f => uploadData.append('files', f));
        const uploadRes = await axios.post('/api/upload', uploadData, config);
        const uploadedUrls = uploadRes.data;
        if (uploadedUrls.length > 0) {
            finalImageUrl = uploadedUrls[0];
            finalAdditionalImages = uploadedUrls.slice(1);
        }
      }

      let finalGlbUrl = formData.glbUrl;
      if (glbFile) {
        const glbUploadData = new FormData();
        glbUploadData.append('files', glbFile);
        const glbRes = await axios.post('/api/upload', glbUploadData, config);
        if (glbRes.data.length > 0) finalGlbUrl = glbRes.data[0];
      }
      
      const payload = { 
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price), 
        stock: parseInt(formData.stock) || 0, 
        imageUrl: finalImageUrl, 
        glbUrl: finalGlbUrl,
        description: formData.description,
        color: formData.color || null,
        material: formData.material || null,
        dimensions: formData.dimensions || null,
        variants: (formData.variants || []).map(v => ({
          ...v,
          stock: parseInt(v.stock) || 0
        }))
      };

      if (editProduct) {
        await axios.put(`/api/products/${editProduct.id}`, payload, config);
        toast.success("Product and variants updated successfully");
      } else {
        await axios.post('/api/products', payload, config);
        toast.success("Product and variants added successfully");
      }
      handleCloseModal();
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  const toggleSelection = (e, id) => {
    e.stopPropagation();
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedProducts(newSelection);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedProducts.size} products?`)) return;
    try {
      const token = localStorage.getItem('token');
      const deletePromises = Array.from(selectedProducts).map(id => 
        axios.delete(`/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      );
      await Promise.all(deletePromises);
      toast.success(`${selectedProducts.size} products deleted successfully`);
      setSelectedProducts(new Set());
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete some products. They might be in user carts.");
      fetchProducts();
    }
  };

  // ===== IMPORT HANDLERS =====
  const handleImportFile = useCallback(async (file) => {
    if (!file) return;
    const ext = file.name.toLowerCase();
    if (!ext.endsWith('.xlsx') && !ext.endsWith('.csv')) {
      toast.error('Only .xlsx and .csv files are supported');
      return;
    }

    setIsImporting(true);
    setImportStatus(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/products/import-file', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

      const importId = res.data.importId;
      toast.success('File accepted! Processing in background...');

      // Polling: Kiểm tra trạng thái import mỗi 2 giây
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await axios.get(`/api/products/import-status/${importId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const status = statusRes.data;
          setImportStatus(status);

          if (status.status === 'COMPLETED' || status.status === 'FAILED') {
            clearInterval(pollInterval);
            setIsImporting(false);
            if (status.status === 'COMPLETED') {
              toast.success(`Import complete: ${status.successRows} products added!`);
              fetchProducts();
            } else {
              toast.error(`Import failed. ${status.failedRows} rows had errors.`);
            }
          }
        } catch {
          clearInterval(pollInterval);
          setIsImporting(false);
        }
      }, 2000);
    } catch (err) {
      setIsImporting(false);
      toast.error(err.response?.data?.error || 'Import failed');
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImportFile(file);
  }, [handleImportFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="w-full pb-20">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 mt-8">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-[#775a19] text-xs tracking-[0.3em] font-semibold uppercase mb-4"
          >
            Inventory
          </motion.p>
          <h1 className="text-5xl font-serif tracking-wide text-[#121212]">
            <SplitText text="Product Catalog" />
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowImport(!showImport)}
            className="flex items-center space-x-3 border border-[#775a19] text-[#775a19] px-6 py-4 rounded-none hover:bg-[#775a19] hover:text-white transition-colors relative overflow-hidden group"
          >
            <Upload className="w-4 h-4" />
            <span className="font-semibold text-xs tracking-widest uppercase">Import Excel</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-3 bg-[#131313] text-white px-8 py-4 rounded-none hover:bg-[#353534] transition-colors relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus className="w-4 h-4" />
            <span className="font-semibold text-xs tracking-widest uppercase">New Product</span>
          </motion.button>
          <AnimatePresence>
            {selectedProducts.size > 0 && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleBulkDelete}
                className="flex items-center space-x-3 bg-[#93000a] text-white px-8 py-4 rounded-none hover:bg-[#690005] transition-colors relative overflow-hidden shadow-lg"
              >
                <X className="w-4 h-4" />
                <span className="font-semibold text-xs tracking-widest uppercase">Delete ({selectedProducts.size})</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ===== DRAG & DROP IMPORT ZONE ===== */}
      <AnimatePresence>
        {showImport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="mb-10 overflow-hidden"
          >
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !isImporting && importInputRef.current?.click()}
              className={`relative border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragging
                  ? 'border-[#775a19] bg-[#fdfbf7] scale-[1.01]'
                  : 'border-[#e2e2e2] bg-white hover:border-[#775a19] hover:bg-[#fdfbf7]'
              }`}
            >
              <input
                ref={importInputRef}
                type="file"
                accept=".xlsx,.csv"
                className="hidden"
                onChange={(e) => handleImportFile(e.target.files[0])}
              />

              {isImporting ? (
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="w-10 h-10 text-[#775a19] animate-spin" />
                  <p className="text-sm font-semibold text-[#121212]">Processing import...</p>
                  {importStatus && (
                    <div className="text-[0.65rem] uppercase tracking-widest text-[#777777] space-y-1">
                      <p>Status: <span className="text-[#121212] font-semibold">{importStatus.status}</span></p>
                      {importStatus.totalRows > 0 && (
                        <p>{importStatus.successRows} / {importStatus.totalRows} rows processed</p>
                      )}
                    </div>
                  )}
                </div>
              ) : importStatus?.status === 'COMPLETED' ? (
                <div className="flex flex-col items-center space-y-3">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                  <p className="text-sm font-semibold text-[#121212]">Import Complete!</p>
                  <p className="text-[0.65rem] uppercase tracking-widest text-[#777777]">
                    {importStatus.successRows} products added successfully
                    {importStatus.failedRows > 0 && `, ${importStatus.failedRows} rows skipped`}
                  </p>
                </div>
              ) : importStatus?.status === 'FAILED' ? (
                <div className="flex flex-col items-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                  <p className="text-sm font-semibold text-[#121212]">Import Failed</p>
                  {importStatus.errorLog && (
                    <pre className="text-[0.65rem] text-left text-red-600 bg-red-50 p-4 max-h-32 overflow-y-auto w-full">
                      {importStatus.errorLog}
                    </pre>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <FileSpreadsheet className="w-12 h-12 text-[#c6c6c6]" />
                  <div>
                    <p className="text-lg font-serif text-[#121212] mb-1">Drop your Excel or CSV file here</p>
                    <p className="text-[0.65rem] uppercase tracking-widest text-[#777777]">
                      Supported: .xlsx, .csv — Columns: name, category, price, stock, description, color, material, dimensions, imageUrl
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Layout */}
      {loading ? (
        <div className="text-center py-20 text-[#777777] animate-pulse uppercase tracking-widest text-xs">Loading catalog...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-[#777777] uppercase tracking-widest text-xs">No objects in catalog.</div>
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
              <SpotlightCard className="h-full group cursor-pointer" onClick={() => handleOpenModal(product)}>
                <div className="relative aspect-square w-full overflow-hidden bg-[#f3f3f3]">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#c6c6c6]">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                  {/* Stock Indicator */}
                  <div className={`absolute top-4 left-4 backdrop-blur-md px-3 py-1 text-[0.65rem] tracking-widest uppercase font-semibold ${product.stock > 0 ? 'bg-white/20 text-white border border-white/20' : 'bg-red-500/80 text-white border border-red-500/50'}`}>
                    {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                  </div>
                  
                  {/* Selection Checkbox */}
                  <div className="absolute top-4 right-4 z-20 bg-white/50 backdrop-blur-sm p-1 rounded hover:bg-white transition-colors" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-[#131313] cursor-pointer"
                      checked={selectedProducts.has(product.id)}
                      onChange={(e) => toggleSelection(e, product.id)}
                    />
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow justify-between bg-white z-10">
                  <div>
                    <p className="text-[#777777] text-[0.65rem] tracking-[0.2em] uppercase font-semibold mb-2">{product.category}</p>
                    <h3 className="font-serif text-2xl text-[#1a1c1c] mb-2 group-hover:text-[#775a19] transition-colors line-clamp-1">{product.name}</h3>
                    <p className="font-mono text-lg text-[#121212] mb-6">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center pt-5 border-t border-[#f3f3f3]">
                    <span className="text-[#90702e] text-xs tracking-widest uppercase font-semibold transition-colors">Edit Asset</span>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }} className="text-[#93000a] hover:text-[#690005] opacity-0 group-hover:opacity-100 text-xs tracking-widest uppercase font-semibold transition-all">Delete</button>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Glassmorphic Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-[#131313]/60 backdrop-blur-xl" onClick={handleCloseModal}></div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-white shadow-[0_24px_48px_rgba(0,0,0,0.2)] border border-[#e2e2e2] rounded-none p-10 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#f3f3f3] rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none" />
              
              <button type="button" onClick={handleCloseModal} className="absolute top-8 right-8 text-[#777777] hover:text-[#1a1c1c] z-10 transition-colors">
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-serif mb-8 text-[#131313]">{editProduct ? 'Edit Portfolio Asset' : 'New Portfolio Asset'}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div className="group">
                        <label className="block text-[0.65rem] font-semibold tracking-[0.2em] text-[#777777] uppercase mb-2 group-focus-within:text-[#131313] transition-colors">Name</label>
                        <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-transparent border-b border-[#e2e2e2] focus:border-[#131313] outline-none py-3 text-sm transition-all focus:bg-[#f9f9f9] px-3" placeholder="e.g., Luna Lounge Chair" />
                      </div>
                        <div className="group">
                          <label className="block text-[0.65rem] font-semibold tracking-[0.2em] text-[#777777] uppercase mb-2 group-focus-within:text-[#131313] transition-colors">Category</label>
                          <select 
                            required 
                            name="category" 
                            value={formData.category} 
                            onChange={handleChange} 
                            className="w-full bg-transparent border-b border-[#e2e2e2] focus:border-[#131313] outline-none py-3 text-sm transition-all focus:bg-[#f9f9f9] px-3 appearance-none cursor-pointer"
                          >
                            <option value="" disabled>Select a category</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="group">
                          <label className="block text-[0.65rem] font-semibold tracking-[0.2em] text-[#777777] uppercase mb-2 group-focus-within:text-[#131313] transition-colors">Price ($)</label>
                          <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full bg-transparent border-b border-[#e2e2e2] focus:border-[#131313] outline-none py-3 text-sm transition-all focus:bg-[#f9f9f9] px-3 font-mono" />
                        </div>
                        <div className="group">
                          <label className="block text-[0.65rem] font-semibold tracking-[0.2em] text-[#777777] uppercase mb-2 group-focus-within:text-[#131313] transition-colors">Stock</label>
                          <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-transparent border-b border-[#e2e2e2] focus:border-[#131313] outline-none py-3 text-sm transition-all focus:bg-[#f9f9f9] px-3 font-mono" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 pt-2">
                        <div className="group">
                          <label className="block text-[0.65rem] font-semibold tracking-[0.2em] text-[#777777] uppercase mb-2 group-focus-within:text-[#131313] transition-colors">Color</label>
                          <select 
                            name="color" 
                            value={formData.color || ''} 
                            onChange={handleChange} 
                            className="w-full bg-transparent border-b border-[#e2e2e2] focus:border-[#131313] outline-none py-3 text-sm transition-all focus:bg-[#f9f9f9] px-3 appearance-none cursor-pointer"
                          >
                            <option value="">Select color</option>
                            {availableColors.map(c => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="group">
                          <label className="block text-[0.65rem] font-semibold tracking-[0.2em] text-[#777777] uppercase mb-2 group-focus-within:text-[#131313] transition-colors">Material</label>
                          <select 
                            name="material" 
                            value={formData.material || ''} 
                            onChange={handleChange} 
                            className="w-full bg-transparent border-b border-[#e2e2e2] focus:border-[#131313] outline-none py-3 text-sm transition-all focus:bg-[#f9f9f9] px-3 appearance-none cursor-pointer"
                          >
                            <option value="">Select material</option>
                            {availableMaterials.map(m => (
                              <option key={m.id} value={m.name}>{m.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="group pt-2">
                        <label className="block text-[0.65rem] font-semibold tracking-[0.2em] text-[#777777] uppercase mb-2 group-focus-within:text-[#131313] transition-colors">Dimensions</label>
                        <input name="dimensions" value={formData.dimensions || ''} onChange={handleChange} className="w-full bg-transparent border-b border-[#e2e2e2] focus:border-[#131313] outline-none py-3 text-sm transition-all focus:bg-[#f9f9f9] px-3" placeholder="e.g., 80x120x75 cm" />
                      </div>
                    </div>
                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* ── Image Upload with Preview ── */}
                      <div>
                        <label className="block text-[0.65rem] font-semibold tracking-[0.2em] text-[#777777] uppercase mb-2">Upload Visual Assets</label>
                        <div className="relative border-2 border-dashed border-[#e2e2e2] hover:border-[#775a19] bg-[#f9f9f9] hover:bg-white transition-all p-8 flex flex-col items-center justify-center cursor-pointer group h-32">
                          <input type="file" multiple accept="image/*" onChange={(e) => setSelectedFiles(Array.from(e.target.files))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          <ImageIcon className="w-8 h-8 text-[#c6c6c6] group-hover:text-[#775a19] transition-colors mb-3" />
                          <p className="text-xs font-semibold uppercase tracking-widest text-[#474747] group-hover:text-[#131313] text-center">
                            {selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : "Drag & Drop Images"}
                          </p>
                        </div>
                        {/* Image Thumbnails Preview */}
                        <AnimatePresence>
                          {imagePreviews.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 grid grid-cols-4 gap-2"
                            >
                              {imagePreviews.map((preview, idx) => (
                                <motion.div
                                  key={preview.name + idx}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className="relative aspect-square rounded overflow-hidden border border-[#e2e2e2] group/thumb bg-[#f3f3f3]"
                                >
                                  <img
                                    src={preview.url}
                                    alt={preview.name}
                                    className="w-full h-full object-cover"
                                  />
                                  {/* Overlay with file info */}
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center p-1">
                                    <Eye className="w-4 h-4 text-white mb-1" />
                                    <span className="text-[0.5rem] text-white/80 text-center truncate w-full px-1">{preview.name}</span>
                                    <span className="text-[0.45rem] text-white/60">{preview.size} KB</span>
                                  </div>
                                  {idx === 0 && (
                                    <div className="absolute top-1 left-1 bg-[#775a19] text-white text-[0.45rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm">
                                      Main
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {/* Existing images preview (when editing) */}
                        {!selectedFiles.length && editProduct?.imageUrl && (
                          <div className="mt-3">
                            <p className="text-[0.55rem] uppercase tracking-widest text-[#999] mb-2">Current images</p>
                            <div className="grid grid-cols-4 gap-2">
                              <div className="relative aspect-square rounded overflow-hidden border border-[#e2e2e2] bg-[#f3f3f3]">
                                <img src={editProduct.imageUrl} alt="Main" className="w-full h-full object-cover" />
                                <div className="absolute top-1 left-1 bg-[#775a19] text-white text-[0.45rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm">Main</div>
                              </div>
                              {(editProduct.additionalImages || []).map((url, idx) => (
                                <div key={idx} className="relative aspect-square rounded overflow-hidden border border-[#e2e2e2] bg-[#f3f3f3]">
                                  <img src={url} alt={`Additional ${idx + 1}`} className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ── 3D Model Upload with Preview ── */}
                      <div>
                        <label className="block text-[0.65rem] font-semibold tracking-[0.2em] text-[#777777] uppercase mb-2">3D Model (.glb)</label>
                        <div className="relative border-2 border-dashed border-[#e2e2e2] hover:border-[#131313] bg-[#f9f9f9] hover:bg-white transition-all p-8 flex flex-col items-center justify-center cursor-pointer group h-32">
                          <input type="file" accept=".glb" onChange={(e) => setGlbFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          <Box className="w-8 h-8 text-[#c6c6c6] group-hover:text-[#131313] transition-colors mb-3" />
                          <p className="text-xs font-semibold uppercase tracking-widest text-[#474747] group-hover:text-[#131313] text-center">
                            {glbFile ? glbFile.name : (formData.glbUrl ? "Change 3D Model" : "Drag & Drop .glb File")}
                          </p>
                        </div>
                        {/* GLB 3D Preview - New local file */}
                        <AnimatePresence>
                          {glbPreviewUrl && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-[0.55rem] uppercase tracking-widest text-[#999]">New model preview</p>
                                <button
                                  type="button"
                                  onClick={() => { setGlbFile(null); setGlbPreviewUrl(null); }}
                                  className="text-[0.55rem] uppercase tracking-widest text-[#93000a] hover:text-[#690005] flex items-center gap-1"
                                >
                                  <X className="w-3 h-3" /> Remove
                                </button>
                              </div>
                              <GlbPreviewCanvas url={glbPreviewUrl} />
                              <p className="text-[0.5rem] text-[#999] mt-1 font-mono">
                                {glbFile?.name} — {(glbFile?.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {/* Existing GLB preview (when editing and no new file selected) */}
                        {formData.glbUrl && !glbFile && (
                          <div className="mt-3">
                            <p className="text-[0.65rem] uppercase tracking-widest text-[#12a150] mb-2 flex items-center gap-2">
                              <CheckCircle className="w-3 h-3" />
                              3D model already linked
                            </p>
                            <GlbPreviewCanvas url={formData.glbUrl} />
                          </div>
                        )}
                      </div>
                      <div className="group">
                         <label className="block text-[0.65rem] font-semibold tracking-[0.2em] text-[#777777] uppercase mb-2 group-focus-within:text-[#131313] transition-colors">Description</label>
                         <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-transparent border-b border-[#e2e2e2] focus:border-[#131313] outline-none py-3 text-sm transition-all focus:bg-[#f9f9f9] px-3 resize-none custom-scrollbar" placeholder="Detailed description of the piece..."></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Variants Management Section */}
                  <div className="border-t border-[#f3f3f3] pt-10 mt-10">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h4 className="text-[0.7rem] font-bold tracking-[0.2em] text-[#1a1c1c] uppercase mb-1">Product Variations</h4>
                        <p className="text-[0.6rem] text-[#777777] uppercase tracking-wider">Independent stock levels for different colors</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={addVariant}
                        className="flex items-center gap-3 px-5 py-2.5 bg-[#f9f9f9] border border-[#e2e2e2] text-[0.65rem] font-bold tracking-widest uppercase text-[#1a1c1c] hover:bg-[#131313] hover:text-white transition-all shadow-sm"
                      >
                        <Plus className="w-3 h-3" /> Add Variation
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.variants && formData.variants.map((variant, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-[#fcfcfc] border border-[#f0f0f0] relative group/variant">
                          <button 
                            type="button" 
                            onClick={() => removeVariant(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-[#e2e2e2] rounded-full flex items-center justify-center text-[#93000a] hover:bg-[#93000a] hover:text-white transition-all shadow-md z-10"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          
                          <div className="space-y-2">
                            <label className="block text-[0.6rem] font-bold tracking-widest text-[#777777] uppercase">Color Name</label>
                            <input 
                              required 
                              className="w-full bg-white border border-[#e2e2e2] py-3 text-xs outline-none px-4 focus:border-[#131313] transition-colors"
                              placeholder="Terracotta"
                              value={variant.color}
                              onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[0.6rem] font-bold tracking-widest text-[#777777] uppercase">Hex Code</label>
                            <input 
                              className="w-full bg-white border border-[#e2e2e2] py-3 text-xs outline-none px-4 focus:border-[#131313] transition-colors font-mono"
                              placeholder="#703225"
                              value={variant.colorCode}
                              onChange={(e) => handleVariantChange(index, 'colorCode', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[0.6rem] font-bold tracking-widest text-[#777777] uppercase">Initial Stock</label>
                            <input 
                              type="number"
                              required 
                              className="w-full bg-white border border-[#e2e2e2] py-3 text-xs outline-none px-4 focus:border-[#131313] transition-colors font-mono"
                              value={variant.stock}
                              onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[0.6rem] font-bold tracking-widest text-[#777777] uppercase">Variation Photo URL</label>
                            <input 
                              className="w-full bg-white border border-[#e2e2e2] py-3 text-xs outline-none px-4 focus:border-[#131313] transition-colors"
                              placeholder="https://..."
                              value={variant.imageUrl}
                              onChange={(e) => handleVariantChange(index, 'imageUrl', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                      {(!formData.variants || formData.variants.length === 0) && (
                        <div className="text-center py-12 bg-[#f9f9f9] border-2 border-dashed border-[#e2e2e2]">
                          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#999999]">No active variations</p>
                          <p className="text-[0.6rem] uppercase tracking-widest text-[#bbbbbb] mt-2">Add colors to manage independent inventory levels</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-8 flex justify-end space-x-4 border-t border-[#e2e2e2]/50 mt-8">
                    <button type="button" onClick={handleCloseModal} className="px-8 py-4 text-xs font-semibold tracking-widest uppercase text-[#777777] hover:text-[#131313] hover:bg-[#f9f9f9] transition-colors">Cancel</button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit" 
                      className="px-8 py-4 bg-[#131313] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#2a2a2a] transition-colors shadow-[0_4px_14px_rgba(0,0,0,0.1)]"
                    >
                      {editProduct ? 'Save Changes' : 'Publish Asset'}
                    </motion.button>
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
