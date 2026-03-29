import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SplitText, SpotlightCard } from '../../components/ui/ReactBits';

// --- Main Page Component --- //

export default function AdminCollections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCollection, setEditCollection] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const [formData, setFormData] = useState({ name: '', type: '', imageUrl: '' });

  const fetchCollections = async () => {
    try {
      const res = await axios.get('/api/collections');
      setCollections(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleOpenModal = (col = null) => {
    setSelectedFiles([]);
    if (col) {
      setEditCollection(col);
      setFormData({ ...col });
    } else {
      setEditCollection(null);
      setFormData({ name: '', type: '', imageUrl: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditCollection(null);
    setSelectedFiles([]);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      let finalImageUrl = formData.imageUrl;
      if (selectedFiles.length > 0) {
        const uploadData = new FormData();
        Array.from(selectedFiles).forEach(f => uploadData.append('files', f));
        const uploadRes = await axios.post('/api/upload', uploadData, config);
        const uploadedUrls = uploadRes.data;
        if (uploadedUrls.length > 0) {
            finalImageUrl = uploadedUrls[0];
        }
      }
      
      const payload = { ...formData, imageUrl: finalImageUrl };

      if (editCollection) {
        await axios.put(`/api/collections/${editCollection.id}`, payload, config);
        toast.success("Collection updated successfully");
      } else {
        await axios.post('/api/collections', payload, config);
        toast.success("Collection added successfully");
      }
      handleCloseModal();
      fetchCollections();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this collection?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/collections/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Collection deleted");
      fetchCollections();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  return (
    <div className="w-full pb-20">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 mt-8">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-[#775a19] text-xs tracking-[0.3em] font-semibold uppercase mb-4"
          >
            Curation
          </motion.p>
          <h1 className="text-5xl font-serif tracking-wide text-[#121212]">
            <SplitText text="Collections" />
          </h1>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-3 bg-[#131313] text-white px-8 py-4 rounded-none hover:bg-[#353534] transition-colors relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus className="w-4 h-4" />
          <span className="font-semibold text-xs tracking-widest uppercase">New Collection</span>
        </motion.button>
      </div>

      {/* Grid Layout (Replaces Table) */}
      {loading ? (
        <div className="text-center py-20 text-[#777777] animate-pulse uppercase tracking-widest text-xs">Loading curation...</div>
      ) : collections.length === 0 ? (
        <div className="text-center py-20 text-[#777777] uppercase tracking-widest text-xs">No collections curated yet.</div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial="hidden" animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
          }}
        >
          {collections.map((col) => (
            <motion.div
              key={col.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
              }}
            >
              <SpotlightCard className="h-full group cursor-pointer" onClick={() => handleOpenModal(col)}>
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f3f3f3]">
                  {col.imageUrl ? (
                    <img 
                      src={col.imageUrl} 
                      alt={col.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#c6c6c6]">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                  {/* Glassmorphic Type Badge */}
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1 text-[0.65rem] tracking-widest uppercase font-semibold">
                    {col.type}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow justify-between bg-white z-10">
                  <h3 className="font-serif text-2xl text-[#1a1c1c] mb-6 group-hover:text-[#775a19] transition-colors">{col.name}</h3>
                  <div className="flex justify-between items-center pt-5 border-t border-[#f3f3f3]">
                    <span className="text-[#90702e] hover:text-[#4f3700] text-xs tracking-widest uppercase font-semibold transition-colors">Edit</span>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(col.id); }} className="text-[#93000a] hover:text-[#690005] opacity-0 group-hover:opacity-100 text-xs tracking-widest uppercase font-semibold transition-all">Delete</button>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Glassmorphic Modal overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-[#131313]/60 backdrop-blur-xl" onClick={handleCloseModal}></div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-white shadow-[0_24px_48px_rgba(0,0,0,0.2)] border border-[#e2e2e2] rounded-none p-10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#f3f3f3] rounded-full blur-3xl -mr-32 -mt-32 opacity-50 point-events-none" />
              
              <button type="button" onClick={handleCloseModal} className="absolute top-8 right-8 text-[#777777] hover:text-[#1a1c1c] z-10 transition-colors">
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-serif mb-8 text-[#131313]">{editCollection ? 'Edit Collection' : 'Curate Collection'}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-[0.65rem] font-semibold tracking-[0.2em] text-[#777777] uppercase mb-2 group-focus-within:text-[#131313] transition-colors">Collection Name</label>
                      <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-transparent border-b border-[#e2e2e2] focus:border-[#131313] outline-none py-3 text-sm transition-all focus:bg-[#f9f9f9] px-3" placeholder="e.g., Ethereal Silks FW25" />
                    </div>
                    <div className="group">
                      <label className="block text-[0.65rem] font-semibold tracking-[0.2em] text-[#777777] uppercase mb-2 group-focus-within:text-[#131313] transition-colors">Theme / Type</label>
                      <input required name="type" value={formData.type} onChange={handleChange} className="w-full bg-transparent border-b border-[#e2e2e2] focus:border-[#131313] outline-none py-3 text-sm transition-all focus:bg-[#f9f9f9] px-3" placeholder="e.g., Ready-to-Wear" />
                    </div>
                    
                    <div>
                      <label className="block text-[0.65rem] font-semibold tracking-[0.2em] text-[#777777] uppercase mb-2">Upload Main Graphic</label>
                      <div className="relative border-2 border-dashed border-[#e2e2e2] hover:border-[#775a19] bg-[#f9f9f9] hover:bg-white transition-all p-8 flex flex-col items-center justify-center cursor-pointer group">
                        <input type="file" accept="image/*" onChange={(e) => setSelectedFiles(e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <ImageIcon className="w-8 h-8 text-[#c6c6c6] group-hover:text-[#775a19] transition-colors mb-3" />
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#474747] group-hover:text-[#131313] text-center">
                          {selectedFiles.length > 0 ? selectedFiles[0].name : "Drag & Drop or Click to Browse"}
                        </p>
                      </div>
                      {formData.imageUrl && selectedFiles.length === 0 && (
                        <p className="text-[0.65rem] uppercase tracking-widest text-[#777777] mt-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#775a19] inline-block"></span>
                          Visual asset attached
                        </p>
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
                      {editCollection ? 'Save Changes' : 'Curate Collection'}
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
