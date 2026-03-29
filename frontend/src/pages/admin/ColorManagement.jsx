import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, X, Edit2, Trash2, Palette, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllColors, createColor, updateColor, deleteColor } from '../../services/colorService';

export default function ColorManagement() {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editColor, setEditColor] = useState(null);
  const [formData, setFormData] = useState({ name: '', hexCode: '#000000' });

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const data = await getAllColors();
      setColors(data);
    } catch (error) {
      toast.error('Failed to load colors');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (color = null) => {
    if (color) {
      setEditColor(color);
      setFormData({ name: color.name, hexCode: color.hexCode });
    } else {
      setEditColor(null);
      setFormData({ name: '', hexCode: '#000000' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editColor) {
        await updateColor(editColor.id, formData);
        toast.success('Color updated');
      } else {
        await createColor(formData);
        toast.success('Color created');
      }
      setIsModalOpen(false);
      fetchColors();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this color?')) {
      try {
        await deleteColor(id);
        toast.success('Color deleted');
        fetchColors();
      } catch (error) {
        toast.error('Failed to delete color');
      }
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#131313]">Color Management</h1>
          <p className="text-sm text-[#777777]">Manage product palette options</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-[#131313] text-white px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-[#2a2a2a] transition-all">
          <Plus size={16} /> Add Color
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#775a19]" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colors.map(color => (
            <div key={color.id} className="bg-white border border-[#e2e2e2] p-4 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-black/5 shadow-inner" style={{ backgroundColor: color.hexCode }} />
                <div>
                  <h3 className="font-semibold text-sm">{color.name}</h3>
                  <code className="text-[10px] text-[#777777] uppercase">{color.hexCode}</code>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(color)} className="p-2 hover:bg-[#f9f9f9] text-[#777777] hover:text-[#131313] transition-colors"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(color.id)} className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white relative w-full max-w-md p-8 shadow-2xl">
              <h2 className="text-2xl font-serif mb-6">{editColor ? 'Edit Color' : 'Add New Color'}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#777777] mb-2">Color Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-b border-[#e2e2e2] py-2 focus:border-[#131313] outline-none text-sm transition-all" placeholder="e.g., Emerald Green" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#777777] mb-2">Hex Color Code</label>
                  <div className="flex gap-4 items-center">
                    <input type="color" value={formData.hexCode} onChange={e => setFormData({...formData, hexCode: e.target.value})} className="w-10 h-10 border-none cursor-pointer p-0" />
                    <input value={formData.hexCode} onChange={e => setFormData({...formData, hexCode: e.target.value})} className="flex-1 border-b border-[#e2e2e2] py-2 focus:border-[#131313] outline-none text-sm font-mono uppercase" placeholder="#000000" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-[#777777] hover:bg-[#f9f9f9]">Cancel</button>
                  <button type="submit" className="bg-[#131313] text-white px-8 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#2a2a2a] transition-all">Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
