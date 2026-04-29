import React, { useState, useEffect } from 'react';
import { getTemplates, deleteDesign } from '../../services/designService';
import { Plus, Trash2, Edit, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      toast.error('Không thể tải danh sách mẫu phòng');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mẫu này?')) {
      try {
        await deleteDesign(id);
        toast.success('Đã xóa mẫu phòng');
        fetchTemplates();
      } catch (error) {
        toast.error('Lỗi khi xóa mẫu phòng');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Quản lý Mẫu Phòng</h1>
          <p className="text-sm text-gray-500 mt-1">Tạo và chỉnh sửa các thiết kế mẫu cho người dùng</p>
        </div>
        <button 
          onClick={() => {
            sessionStorage.removeItem('loadDesign');
            navigate('/admin/templates/create');
          }}
          className="flex items-center gap-2 bg-[#131313] text-white px-6 py-2.5 rounded-full hover:bg-black transition-all text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> Tạo Mẫu Mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            <div className="aspect-video bg-gray-100 relative">
              {template.thumbnailUrl ? (
                <img src={template.thumbnailUrl} alt={template.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 italic text-xs">
                  Chưa có thumbnail
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button 
                  onClick={() => {
                    sessionStorage.setItem('loadDesign', JSON.stringify(template));
                    navigate('/admin/templates/create');
                  }}
                  className="p-2 bg-white rounded-full hover:scale-110 transition-transform"
                >
                  <Edit className="w-4 h-4 text-gray-900" />
                </button>
                <button 
                  onClick={() => handleDelete(template.id)}
                  className="p-2 bg-white rounded-full hover:scale-110 transition-transform"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
              <p className="text-xs text-gray-500 mt-1">Cập nhật: {new Date(template.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}

        {templates.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl text-gray-400">
            <Box className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Chưa có mẫu phòng nào. Hãy tạo mẫu đầu tiên!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTemplates;
