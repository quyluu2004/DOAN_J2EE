import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDesignsByUser, deleteDesign } from '../services/designService';
import { Trash2, Edit3, Clock, Layers, Box, Plus } from 'lucide-react';
import { toast } from 'sonner';

const MyDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (user) fetchDesigns();
    else setLoading(false);
  }, []);

  const fetchDesigns = async () => {
    try {
      const data = await getDesignsByUser(user.id);
      setDesigns(data);
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải danh sách thiết kế');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa bản thiết kế này?')) return;
    try {
      await deleteDesign(id);
      setDesigns(designs.filter(d => d.id !== id));
      toast.success('Đã xóa bản thiết kế!');
    } catch (err) {
      toast.error('Lỗi khi xóa');
    }
  };

  const handleLoad = (design) => {
    // Lưu designData vào sessionStorage để RoomDesigner load
    sessionStorage.setItem('loadDesign', JSON.stringify(design));
    navigate('/3d-designer');
  };

  const parseDesignInfo = (designData) => {
    try {
      const data = JSON.parse(designData);
      const totalItems = (data.floors || []).reduce((s, f) => s + (f.items?.length || 0), 0);
      const totalWalls = (data.floors || []).reduce((s, f) => s + (f.walls?.length || 0), 0);
      return {
        floors: data.floors?.length || 1,
        items: totalItems,
        walls: totalWalls,
        size: `${data.roomWidth || 10}m × ${data.roomDepth || 10}m`
      };
    } catch { return { floors: 1, items: 0, walls: 0, size: '10m × 10m' }; }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Box className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold mb-2">Vui lòng đăng nhập</h2>
          <p className="text-gray-500">Bạn cần đăng nhập để xem bản thiết kế đã lưu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bản thiết kế của tôi</h1>
            <p className="text-sm text-gray-500 mt-1">{designs.length} bản thiết kế</p>
          </div>
          <button onClick={() => navigate('/3d-designer')}
            className="flex items-center gap-2 bg-[#131313] text-white px-5 py-2.5 rounded-full hover:bg-black transition-colors text-sm font-semibold">
            <Plus className="w-4 h-4" /> Tạo mới
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Đang tải...</div>
        ) : designs.length === 0 ? (
          <div className="text-center py-20">
            <Box className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-500">Chưa có bản thiết kế nào</h3>
            <p className="text-sm text-gray-400 mt-1">Hãy bắt đầu thiết kế căn phòng đầu tiên!</p>
            <button onClick={() => navigate('/3d-designer')}
              className="mt-4 bg-[#775a19] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#5a4310] transition-colors">
              Bắt đầu thiết kế
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {designs.map((design) => {
              const info = parseDesignInfo(design.designData);
              return (
                <div key={design.id} className="bg-white rounded-2xl border hover:shadow-lg transition-all group overflow-hidden">
                  {/* Preview */}
                  <div className="h-40 bg-gradient-to-br from-[#e8e3db] to-[#d4cfc7] flex items-center justify-center relative">
                    <div className="text-center">
                      <Box className="w-10 h-10 mx-auto text-[#775a19]/40" />
                      <p className="text-xs text-[#775a19]/60 mt-1">{info.size}</p>
                    </div>
                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                      <button onClick={() => handleLoad(design)}
                        className="bg-white text-[#131313] px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-100 transition shadow-lg">
                        <Edit3 className="w-3.5 h-3.5" /> Mở
                      </button>
                      <button onClick={() => handleDelete(design.id)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm truncate">{design.name || 'Untitled'}</h3>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                      <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {info.floors} tầng</span>
                      <span>{info.items} đồ</span>
                      <span>{info.walls} tường</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-300">
                      <Clock className="w-3 h-3" />
                      {design.createdAt ? new Date(design.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDesigns;
