import React, { useState, useEffect, useMemo } from 'react';
import RoomCanvas from '../components/three/RoomCanvas';
import { useStore } from '../store/useStore';
import { getAllProducts } from '../services/productService';
import { saveDesign, uploadThumbnail } from '../services/designService';
import { 
  Plus, Save, Trash2, Box, Layers, Maximize, X, 
  MousePointer, PenTool, DoorOpen, SquareStack, 
  Palette, DollarSign, Eye, BoxSelect, Map, 
  Ruler, Type, Image as LucideImage, Upload, 
  ChevronRight, Layout, Sparkles, Home, ShoppingCart, Check, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { getTemplates } from '../services/designService';
import { BlurText, SpotlightCard } from '../components/ui/ReactBits';
import { addToCart } from '../services/cartService';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';


const WALL_COLORS = [
  { name: 'Onyx', color: '#1A1A1A' },
  { name: 'Warm White', color: '#F5F0E8' },
  { name: 'Graphite', color: '#333333' },
  { name: 'Bronze', color: '#775A19' },
  { name: 'Soft Grey', color: '#E0DDD5' },
  { name: 'Champagne', color: '#F5EDDA' },
];

const FLOOR_OPTIONS = [
  { type: 'wood', name: 'Gỗ sồi', color: '#C4A882' },
  { type: 'wood', name: 'Gỗ tối', color: '#8B6F47' },
  { type: 'wood', name: 'Gỗ nhạt', color: '#DEC9A8' },
  { type: 'tile', name: 'Gạch trắng', color: '#E8E4DE' },
  { type: 'tile', name: 'Gạch xám', color: '#B0ADA6' },
  { type: 'marble', name: 'Đá trắng', color: '#F0EDE8' },
  { type: 'marble', name: 'Đá xám', color: '#C8C4BC' },
  { type: 'concrete', name: 'Bê tông', color: '#CCC8C0' },
];

const RoomDesigner = ({ isAdmin = false }) => {
  const [products, setProducts] = useState([]);
  const {
    floors, activeFloorId, addItem, removeItem,
    addFloor, removeFloor, setActiveFloor,
    roomWidth, roomDepth, wallHeight,
    setRoomWidth, setRoomDepth, setWallHeight,
    wallColor, setWallColor, floorType, floorColor, setFloorType, setFloorColor,
    toolMode, setToolMode, wallStart,
    getDesignData, loadDesignData,
    viewMode, setViewMode,
    selectedId, setSelectedId
  } = useStore();

  const [designName, setDesignName] = useState('Thiết kế chưa đặt tên');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedCheckoutIds, setSelectedCheckoutIds] = useState(new Set());
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const navigate = useNavigate();
  const [designId, setDesignId] = useState(null);
  const [activeTab, setActiveTab] = useState('templates'); // 'templates' | 'furniture' | 'style'
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const { fetchCart, openCart } = useCart();


  const activeFloor = floors.find(f => f.id === activeFloorId);
  const activeItems = activeFloor ? activeFloor.items : [];
  const activeWalls = activeFloor ? (activeFloor.walls || []) : [];

  // Tính tổng chi phí
  const totalCost = useMemo(() => {
    const totalCost = floors.reduce((sum, floor) => {
      return sum + (floor.items || []).reduce((acc, item) => {
        const product = products.find(p => p.id === item.productId);
        return acc + (product?.price || 0);
      }, 0);
    }, 0);
    return totalCost;
  }, [floors, products]);

  const allRoomItems = floors.flatMap(f => (f.items || []).map(i => ({
    ...i,
    floorName: f.name,
    price: products.find(p => p.id === i.productId)?.price || 0,
    imageUrl: products.find(p => p.id === i.productId)?.imageUrl || ''
  })));

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thực hiện mua sắm');
      return;
    }

    if (selectedCheckoutIds.size === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm');
      return;
    }

    setIsProcessingCheckout(true);
    try {
      const itemsToBuy = allRoomItems.filter(i => selectedCheckoutIds.has(i.id));
      // Adding items to cart
      
      // Thêm tuần tự để tránh race condition trên backend
      for (const item of itemsToBuy) {
        await addToCart(item.productId, null, 1);
      }
      
      // Đồng bộ lại giỏ hàng trong context
      await fetchCart();
      
      toast.success(`Đã thêm ${itemsToBuy.length} sản phẩm vào giỏ hàng`);
      setIsCheckoutModalOpen(false);
      openCart(); // Mở sidebar giỏ hàng để user thấy ngay
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
      console.error(error);
    } finally {
      setIsProcessingCheckout(false);
    }
  };


  const toggleAllSelection = () => {
    if (selectedCheckoutIds.size === allRoomItems.length) {
      setSelectedCheckoutIds(new Set());
    } else {
      setSelectedCheckoutIds(new Set(allRoomItems.map(i => i.id)));
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchTemplates();
    // Load bản thiết kế đã lưu nếu có
    const savedDesign = sessionStorage.getItem('loadDesign');
    if (savedDesign) {
      handleLoadTemplate(savedDesign);
      sessionStorage.removeItem('loadDesign');
    }
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setTemplatesLoading(false);
    }
  };

  const handleLoadTemplate = (designStr) => {
    try {
      const design = typeof designStr === 'string' ? JSON.parse(designStr) : designStr;
      setDesignName(design.name || 'Inspired Design');
      setThumbnailUrl(design.thumbnailUrl || '');
      if (isAdmin && design.id) setDesignId(design.id);
      if (design.designData) loadDesignData(design.designData);
      toast.success(`Đã tải mẫu: ${design.name}`);
    } catch (e) { console.error(e); }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadThumbnail(file);
      setThumbnailUrl(url);
      toast.success('Đã tải lên ảnh thumbnail!');
    } catch (error) {
      toast.error('Lỗi khi tải ảnh lên');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data.filter(p => p.glbUrl));
    } catch (error) { console.error('Failed to fetch products:', error); }
  };

  const handleSave = async () => {
    if (!user) { toast.error('Vui lòng đăng nhập để lưu thiết kế'); return; }
    try {
      const payload = { 
        userId: user.id || user.userId, 
        name: designName, 
        designData: getDesignData(), 
        thumbnailUrl: thumbnailUrl, 
        template: isAdmin
      };
      if (isAdmin && designId) payload.id = designId;
      
      const saved = await saveDesign(payload);
      if (isAdmin) setDesignId(saved.id);
      
      toast.success('Đã lưu bản thiết kế!');
    } catch (error) { 
      console.error(error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Lỗi không xác định';
      toast.error('Lỗi API: ' + errorMsg); 
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] mt-[80px] bg-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col bg-white overflow-hidden shrink-0 shadow-sm relative z-20">
        {/* Room Settings */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Maximize className="w-4 h-4 text-[#775a19]" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Kích thước</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[['Rộng', roomWidth, setRoomWidth, 4, 30, 1], ['Dài', roomDepth, setRoomDepth, 4, 30, 1], ['Cao', wallHeight, setWallHeight, 2, 6, 0.5]].map(([label, val, setter, min, max, step]) => (
              <div key={label}>
                <label className="text-[9px] text-gray-400 uppercase">{label}</label>
                <input type="number" min={min} max={max} step={step} value={val}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="w-full mt-1 px-2 py-1 border rounded-lg text-xs text-center focus:ring-1 focus:ring-[#775a19] outline-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Chế độ xem</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setViewMode('3D')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold transition-all ${viewMode === '3D' ? 'bg-[#775a19] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <BoxSelect className="w-4 h-4" /> 3D VIEW
            </button>
            <button
              onClick={() => setViewMode('2D')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold transition-all ${viewMode === '2D' ? 'bg-[#775a19] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <Map className="w-4 h-4" /> 2D PLAN
            </button>
          </div>

          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Công cụ</h3>
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { mode: 'select', icon: <MousePointer className="w-3.5 h-3.5" />, label: 'Chọn' },
              { mode: 'wall', icon: <PenTool className="w-3.5 h-3.5" />, label: 'Tường' },
              { mode: 'ruler', icon: <Ruler className="w-3.5 h-3.5" />, label: 'Thước' },
              { mode: 'annotation', icon: <Type className="w-3.5 h-3.5" />, label: 'Ghi chú' },
              { mode: 'walk', icon: <Eye className="w-3.5 h-3.5" />, label: 'Đi bộ' },
            ].map((tool) => (
              <button key={tool.mode}
                disabled={viewMode === '2D' && tool.mode === 'walk'}
                onClick={() => { setToolMode(tool.mode === 'door' || tool.mode === 'window' ? 'select' : tool.mode); tool.action?.(); }}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-medium transition-all ${toolMode === tool.mode ? 'bg-[#775a19] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } ${viewMode === '2D' && tool.mode === 'walk' ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                {tool.icon}
                {tool.label}
              </button>
            ))}
          </div>
          {toolMode === 'wall' && (
            <p className="text-[10px] text-[#775a19] mt-2 text-center font-medium animate-pulse">
              {wallStart ? '👆 Click lần nữa để kết thúc tường' : '👆 Click lên sàn để vẽ tường'}
            </p>
          )}
          {toolMode === 'walk' && (
            <p className="text-[10px] text-[#775a19] mt-2 text-center leading-relaxed">
              👁️ Click vào canvas để bắt đầu đi bộ<br />ESC để thoát
            </p>
          )}
        </div>

        {/* Property Editor */}
        {selectedId && (
          <div className="p-4 border-b bg-[#775a19]/5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#775a19]">
                {selectedId.startsWith('wall-') ? 'Cài đặt Tường' : 'Cài đặt Nội thất'}
              </h4>
              <button
                onClick={() => {
                  if (selectedId.startsWith('wall-')) {
                    useStore.getState().removeWall(selectedId.replace('wall-', ''));
                  } else {
                    removeItem(selectedId);
                  }
                }}
                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {selectedId.startsWith('wall-') && (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Độ dày tường</label>
                    <span className="text-[10px] font-bold text-[#775a19]">
                      {(activeWalls.find(w => w.id === selectedId.replace('wall-', ''))?.thickness || 0.15).toFixed(2)}m
                    </span>
                  </div>
                  <input
                    type="range" min="0.1" max="0.5" step="0.05"
                    value={activeWalls.find(w => w.id === selectedId.replace('wall-', ''))?.thickness || 0.15}
                    onChange={(e) => useStore.getState().updateWall(selectedId.replace('wall-', ''), { thickness: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#775a19]"
                  />
                </div>
              </div>
            )}

            {!selectedId.startsWith('wall-') && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => useStore.getState().setTransformMode('translate')}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
                      useStore.getState().transformMode === 'translate' ? 'bg-[#775a19] text-white' : 'bg-white text-gray-400 border'
                    }`}
                  >
                    Di chuyển
                  </button>
                  <button
                    onClick={() => useStore.getState().setTransformMode('rotate')}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
                      useStore.getState().transformMode === 'rotate' ? 'bg-[#775a19] text-white' : 'bg-white text-gray-400 border'
                    }`}
                  >
                    Xoay
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 italic">
                  {useStore.getState().transformMode === 'translate' ? 'Kéo để di chuyển' : 'Kéo các vòng tròn để xoay'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Floors */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#775a19]" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Tầng</h3>
            </div>
            <button onClick={addFloor} className="text-[10px] text-[#775a19] hover:text-[#5a4310] font-semibold flex items-center gap-0.5">
              <Plus className="w-3 h-3" /> Thêm
            </button>
          </div>
          <div className="space-y-1">
            {floors.map((floor) => (
              <div key={floor.id}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg cursor-pointer text-xs transition-all ${floor.id === activeFloorId ? 'bg-[#131313] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                onClick={() => setActiveFloor(floor.id)}
              >
                <span className="font-medium">{floor.name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-gray-400">{floor.items.length}đồ·{(floor.walls || []).length}tường</span>
                  {floors.length > 1 && (
                    <button onClick={(e) => { e.stopPropagation(); removeFloor(floor.id); }}
                      className="p-0.5 rounded hover:bg-red-500/20"><X className="w-3 h-3" /></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Switch: Mẫu / Nội thất / Phong cách */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button onClick={() => setActiveTab('templates')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'templates' ? 'text-[#775a19]' : 'text-gray-400 hover:text-gray-600'}`}>
            <Home className="w-3.5 h-3.5 mx-auto mb-1" />
            Mẫu
            {activeTab === 'templates' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#775a19] rounded-full" />}
          </button>
          <button onClick={() => setActiveTab('furniture')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'furniture' ? 'text-[#775a19]' : 'text-gray-400 hover:text-gray-600'}`}>
            <Box className="w-3.5 h-3.5 mx-auto mb-1" />
            Đồ dùng
            {activeTab === 'furniture' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#775a19] rounded-full" />}
          </button>
          <button onClick={() => setActiveTab('style')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'style' ? 'text-[#775a19]' : 'text-gray-400 hover:text-gray-600'}`}>
            <Palette className="w-3.5 h-3.5 mx-auto mb-1" />
            Vật liệu
            {activeTab === 'style' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#775a19] rounded-full" />}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'templates' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#775a19]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Không gian gợi ý</span>
              </div>
              {templatesLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#775a19]"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {templates.map((template) => (
                    <SpotlightCard key={template.id} className="p-0 overflow-hidden border-none cursor-pointer group" onClick={() => handleLoadTemplate(template)}>
                      <div className="relative aspect-video">
                        <img src={template.thumbnailUrl || 'https://via.placeholder.com/300x170?text=ÉLITAN+Space'} alt={template.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                           <h4 className="text-white text-xs font-bold leading-tight">{template.name}</h4>
                          <p className="text-[9px] text-gray-300 mt-0.5">ÉLITAN Curator Edition</p>
                        </div>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'furniture' ? (
            <div className="p-4 space-y-3">
              {products.map((product) => (
                <div key={product.id}
                  className="group border rounded-xl p-3 hover:border-[#775a19] transition-all cursor-pointer bg-gray-50"
                  onClick={() => { setToolMode('select'); addItem({ productId: product.id, name: product.name, glbUrl: product.glbUrl, position: [0, 0, 0], rotation: [0, 0, 0] }); }}
                >
                  <img src={product.imageUrl} alt={product.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                  <h3 className="text-xs font-semibold truncate">{product.name}</h3>
                  <p className="text-[10px] text-[#775a19] font-bold">${product.price}</p>
                </div>
              ))}
              {products.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Box className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-[10px]">Không có sản phẩm 3D</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 space-y-5">
              {/* Màu tường */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1">
                  <Palette className="w-3 h-3" /> Màu tường
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {WALL_COLORS.map((c) => (
                    <button key={c.color} onClick={() => setWallColor(c.color)}
                      className={`w-full aspect-square rounded-xl border-2 transition-all hover:scale-105 ${wallColor === c.color ? 'border-[#775a19] ring-2 ring-[#775a19]/20' : 'border-gray-200'
                        }`}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Loại sàn */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">🪵 Loại sàn</h4>
                <div className="grid grid-cols-2 gap-2">
                  {FLOOR_OPTIONS.map((f, i) => (
                    <button key={i} onClick={() => { setFloorType(f.type); setFloorColor(f.color); }}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all text-left ${floorType === f.type && floorColor === f.color ? 'border-[#775a19] bg-[#775a19]/5' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: f.color }} />
                      <span className="text-[10px] font-medium">{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative">
        {/* Top bar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center bg-white/90 backdrop-blur-xl p-2.5 px-6 rounded-2xl border border-white/20 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#131313] rounded-lg flex items-center justify-center">
              <span className="text-[#e8c176] font-serif font-bold text-lg">É</span>
            </div>
            <div className="flex flex-col">
              <input type="text" value={designName} onChange={(e) => setDesignName(e.target.value)}
                className="bg-transparent border-none font-serif text-base focus:ring-0 w-48 outline-none text-gray-900 font-bold p-0" />
              <span className="text-[9px] text-gray-400 uppercase tracking-widest -mt-0.5">ÉLITAN 3D Studio</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <div className="flex items-center gap-2 border-r pr-3">
                <label className="cursor-pointer flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 px-3 py-2 rounded-xl border transition-all text-[10px] font-bold uppercase tracking-wider">
                  <Upload className="w-3.5 h-3.5" />
                  {isUploading ? 'Đang tải...' : 'Thumbnail'}
                  <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} disabled={isUploading} />
                </label>
                {thumbnailUrl && (
                  <div className="relative group">
                    <img src={thumbnailUrl} alt="Preview" className="w-9 h-9 object-cover rounded-lg border-2 border-[#775a19]" />
                    <button onClick={() => setThumbnailUrl('')} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
            <span className="text-[10px] text-gray-500 font-medium px-3 py-1 bg-gray-50 rounded-lg border">{activeFloor?.name}</span>
            <button onClick={handleSave}
              disabled={isUploading}
              className="flex items-center gap-2 bg-[#131313] text-white px-6 py-2.5 rounded-full hover:bg-black transition-all hover:scale-105 active:scale-95 text-xs font-bold shadow-lg disabled:opacity-50">
              <Save className="w-3.5 h-3.5" /> LƯU THIẾT KẾ
            </button>
          </div>
        </div>

        <RoomCanvas />

        {/* Walk mode overlay */}
        {toolMode === 'walk' && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 bg-black/70 backdrop-blur text-white px-6 py-3 rounded-2xl text-center pointer-events-none">
            <p className="text-sm font-semibold mb-1">👁️ Chế độ đi bộ</p>
            <p className="text-[11px] text-gray-300">Click vào canvas để bắt đầu · <b>WASD</b> để di chuyển · <b>Chuột</b> để nhìn quanh · <b>ESC</b> để thoát</p>
          </div>
        )}

        {/* Bottom Left - Items list */}
        {activeItems.length > 0 && (
          <div className="absolute bottom-4 left-4 max-h-40 overflow-y-auto w-56 bg-white/85 backdrop-blur-md rounded-2xl border p-3 shadow-sm z-10">
            <h4 className="text-[9px] uppercase tracking-widest font-bold mb-1.5 text-gray-400">{activeFloor?.name}</h4>
            <div className="space-y-1">
              {activeItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-1 hover:bg-white rounded group">
                  <span className="text-[11px] truncate pr-2">{item.name}</span>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Right - Tổng chi phí */}
        <div className="absolute bottom-4 right-4 bg-white/85 backdrop-blur-md rounded-2xl border p-4 shadow-sm z-10 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-[#775a19]" />
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Tổng chi phí</h4>
          </div>
          <p className="text-2xl font-bold text-[#131313]">
            ${totalCost.toLocaleString()}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            {floors.reduce((sum, f) => sum + f.items.length, 0)} sản phẩm · {floors.length} tầng
          </p>
          <button
            onClick={() => {
              setSelectedCheckoutIds(new Set(allRoomItems.map(i => i.id)));
              setIsCheckoutModalOpen(true);
            }}
            className="w-full mt-3 bg-[#775a19] text-white py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-[#5f4814] transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Thanh toán
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-xl w-full max-w-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-xl font-serif font-bold text-gray-900">Thanh toán thiết kế</h2>
                <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-1">Chọn sản phẩm bạn muốn đặt mua</p>
              </div>
              <button onClick={() => setIsCheckoutModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              <div className="flex justify-between items-center mb-4 px-2">
                <button onClick={toggleAllSelection} className="text-[11px] font-bold text-[#775a19] uppercase tracking-wider hover:underline">
                  {selectedCheckoutIds.size === allRoomItems.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </button>
                <span className="text-[11px] text-gray-400 uppercase font-bold">{selectedCheckoutIds.size}/{allRoomItems.length} sản phẩm</span>
              </div>

              {allRoomItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center gap-4 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedCheckoutIds.has(item.id) ? 'border-[#775a19] bg-[#775a19]/5' : 'border-gray-100 hover:border-gray-200'
                  }`}
                  onClick={() => {
                    const next = new Set(selectedCheckoutIds);
                    if (next.has(item.id)) next.delete(item.id);
                    else next.add(item.id);
                    setSelectedCheckoutIds(next);
                  }}
                >
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-xl border" />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{item.floorName}</p>
                    <p className="text-sm font-black text-[#775a19] mt-1">${item.price.toLocaleString()}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedCheckoutIds.has(item.id) ? 'bg-[#775a19] border-[#775a19]' : 'border-gray-300'
                  }`}>
                    {selectedCheckoutIds.has(item.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gray-50/80 border-t space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Tổng cộng ({selectedCheckoutIds.size} món)</p>
                  <p className="text-2xl font-black text-gray-900">
                    ${allRoomItems
                      .filter(i => selectedCheckoutIds.has(i.id))
                      .reduce((sum, i) => sum + i.price, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessingCheckout || selectedCheckoutIds.size === 0}
                  className="bg-[#131313] text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-xl disabled:opacity-50 disabled:grayscale flex items-center gap-2"
                >
                  {isProcessingCheckout ? 'Đang xử lý...' : (
                    <>
                      XÁC NHẬN MUA <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDesigner;
