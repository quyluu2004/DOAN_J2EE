import React, { useState, useEffect, useMemo } from 'react';
import RoomCanvas from '../components/three/RoomCanvas';
import { useStore } from '../store/useStore';
import { getAllProducts } from '../services/productService';
import { saveDesign } from '../services/designService';
import { Plus, Save, Trash2, Box, Layers, Maximize, X, MousePointer, PenTool, DoorOpen, SquareStack, Palette, DollarSign, Eye, BoxSelect, Map, Ruler, Type } from 'lucide-react';
import { toast } from 'sonner';

const WALL_COLORS = [
  { name: 'Kem', color: '#F5F0E8' },
  { name: 'Trắng', color: '#FFFFFF' },
  { name: 'Xám nhạt', color: '#E0DDD5' },
  { name: 'Xanh pastel', color: '#D4E6DC' },
  { name: 'Hồng pastel', color: '#F0DDD6' },
  { name: 'Vàng nhạt', color: '#F5EDDA' },
  { name: 'Xanh dương nhạt', color: '#D6E3F0' },
  { name: 'Xám đậm', color: '#A0A0A0' },
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

const RoomDesigner = () => {
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

  const [designName, setDesignName] = useState('New Room Design');
  const [activeTab, setActiveTab] = useState('furniture'); // 'furniture' | 'style'
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const activeFloor = floors.find(f => f.id === activeFloorId);
  const activeItems = activeFloor ? activeFloor.items : [];
  const activeWalls = activeFloor ? (activeFloor.walls || []) : [];

  // Tính tổng chi phí
  const totalCost = useMemo(() => {
    let total = 0;
    floors.forEach(f => {
      f.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) total += Number(product.price);
      });
    });
    return total;
  }, [floors, products]);

  useEffect(() => {
    fetchProducts();
    // Load bản thiết kế đã lưu nếu có
    const savedDesign = sessionStorage.getItem('loadDesign');
    if (savedDesign) {
      try {
        const design = JSON.parse(savedDesign);
        setDesignName(design.name || 'Loaded Design');
        if (design.designData) loadDesignData(design.designData);
      } catch (e) { console.error(e); }
      sessionStorage.removeItem('loadDesign');
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data.filter(p => p.glbUrl));
    } catch (error) { console.error('Failed to fetch products:', error); }
  };

  const handleSave = async () => {
    if (!user) { toast.error('Vui lòng đăng nhập để lưu thiết kế'); return; }
    try {
      await saveDesign({ userId: user.id, name: designName, designData: getDesignData(), thumbnailUrl: '' });
      toast.success('Đã lưu bản thiết kế!');
    } catch (error) { toast.error('Lỗi khi lưu thiết kế'); }
  };

  const handleAddDoor = () => {
    addItem({ productId: 'door', name: '🚪 Cửa ra vào', glbUrl: '', position: [0, 0, 0], rotation: [0, 0, 0], type: 'door' });
  };
  const handleAddWindow = () => {
    addItem({ productId: 'window', name: '🪟 Cửa sổ', glbUrl: '', position: [0, 1, 0], rotation: [0, 0, 0], type: 'window' });
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
              { mode: 'door', icon: <DoorOpen className="w-3.5 h-3.5" />, label: 'Cửa', action: handleAddDoor },
              { mode: 'window', icon: <SquareStack className="w-3.5 h-3.5" />, label: 'Cửa sổ', action: handleAddWindow },
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

        {/* Tab Switch: Nội thất / Phong cách */}
        <div className="flex border-b">
          <button onClick={() => setActiveTab('furniture')}
            className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest transition ${activeTab === 'furniture' ? 'text-[#775a19] border-b-2 border-[#775a19]' : 'text-gray-400'}`}>
            🪑 Nội thất
          </button>
          <button onClick={() => setActiveTab('style')}
            className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest transition ${activeTab === 'style' ? 'text-[#775a19] border-b-2 border-[#775a19]' : 'text-gray-400'}`}>
            🎨 Phong cách
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
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
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center bg-white/85 backdrop-blur-md p-2.5 px-4 rounded-2xl border shadow-sm">
          <input type="text" value={designName} onChange={(e) => setDesignName(e.target.value)}
            className="bg-transparent border-none font-serif text-base focus:ring-0 w-48 outline-none" />
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-500 font-medium px-3 py-1 bg-gray-50 rounded-lg border">{activeFloor?.name}</span>
            <button onClick={handleSave}
              className="flex items-center gap-1.5 bg-[#131313] text-white px-5 py-2.5 rounded-full hover:bg-black transition-all hover:scale-105 active:scale-95 text-xs font-semibold shadow-sm">
              <Save className="w-3.5 h-3.5" /> Lưu
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
        </div>
      </div>
    </div>
  );
};

export default RoomDesigner;
