import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { SplitText } from '../../components/ui/ReactBits';
import { Shield, ShieldAlert, User, Mail, Globe } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/users/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId, role) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/users/${userId}/role`, { role }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User clearance updated");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user clearance");
    }
  };

  return (
    <div className="w-full pb-20">
      <div className="flex justify-between items-end mb-12 mt-8">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-[#775a19] text-xs tracking-[0.3em] font-semibold uppercase mb-4"
          >
            Network
          </motion.p>
          <h1 className="text-5xl font-serif tracking-wide text-[#121212]">
            <SplitText text="Clientele & Staff" />
          </h1>
        </div>
      </div>

      <div className="space-y-4">
        {/* Header Row */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 text-[#777777] font-semibold text-[0.65rem] tracking-widest uppercase border-b border-[#e2e2e2]">
          <div className="col-span-4">Identity</div>
          <div className="col-span-3">Contact</div>
          <div className="col-span-2">Clearance</div>
          <div className="col-span-1 border-l border-[#e2e2e2] pl-4">Origin</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Loading / Empty States */}
        {loading ? (
          <div className="px-8 py-20 text-center text-[#777777] uppercase tracking-widest text-[0.65rem] animate-pulse">Loading network...</div>
        ) : users.length === 0 ? (
          <div className="px-8 py-20 text-center text-[#777777] uppercase tracking-widest text-[0.65rem]">No profiles found.</div>
        ) : (
          <AnimatePresence>
            {users.map((user, index) => (
              <motion.div
                layout
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05, type: 'spring', stiffness: 200, damping: 25 }}
                className="bg-white border border-[#e2e2e2] hover:border-[#775a19] transition-colors p-6 md:p-8 flex flex-col md:grid md:grid-cols-12 gap-6 items-start md:items-center group"
              >
                {/* Identity */}
                <div className="col-span-4 w-full flex items-center space-x-4">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-none flex-shrink-0 ${user.role === 'ADMIN' ? 'bg-[#fdfbf7] border border-[#ffdea5] text-[#4f3700]' : 'bg-[#f3f3f3] text-[#777777]'}`}>
                    {user.role === 'ADMIN' ? <ShieldAlert className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-[0.65rem] text-[#777777] uppercase tracking-widest mb-1 md:hidden">Identity</p>
                    <div className="font-serif text-2xl text-[#121212] leading-none mb-1">{user.fullName}</div>
                    <div className="text-[#a0a0a0] font-mono text-[0.65rem] uppercase tracking-widest">ID: {String(user.id).substring(0, 8)}...</div>
                  </div>
                </div>

                {/* Contact */}
                <div className="col-span-3 w-full">
                  <p className="text-[0.65rem] text-[#777777] uppercase tracking-widest mb-1 md:hidden">Contact</p>
                  <div className="flex items-center space-x-2 text-[#474747]">
                    <Mail className="w-3.5 h-3.5 text-[#a0a0a0]" />
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                </div>

                {/* Clearance */}
                <div className="col-span-2 w-full">
                  <p className="text-[0.65rem] text-[#777777] uppercase tracking-widest mb-1 md:hidden">Clearance</p>
                  <div className="inline-flex items-center space-x-2">
                    {user.role === 'ADMIN' ? (
                      <>
                        <Shield className="w-3.5 h-3.5 text-[#775a19]" />
                        <span className="text-[#775a19] font-semibold tracking-widest text-[0.65rem] uppercase">Curator</span>
                      </>
                    ) : (
                      <span className="text-[#777777] font-medium tracking-widest text-[0.65rem] uppercase">Client</span>
                    )}
                  </div>
                </div>

                {/* Origin (Provider) */}
                <div className="col-span-1 w-full md:border-l md:border-[#e2e2e2] md:pl-4">
                  <p className="text-[0.65rem] text-[#777777] uppercase tracking-widest mb-1 md:hidden">Origin</p>
                  <div className="flex items-center space-x-1.5 text-[#a0a0a0]">
                    <Globe className="w-3.5 h-3.5" />
                    <span className="text-[0.65rem] uppercase tracking-wider font-semibold">{user.provider}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-2 w-full flex md:justify-end space-x-4 pt-4 md:pt-0 border-t border-[#e2e2e2] md:border-none mt-4 md:mt-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  {user.role === 'USER' ? (
                    <button onClick={() => updateRole(user.id, 'ADMIN')} className="px-4 py-2 border border-[#775a19] text-[#90702e] hover:bg-[#775a19] hover:text-white text-[0.65rem] tracking-widest uppercase font-semibold transition-colors">
                      Elevate
                    </button>
                  ) : (
                    <button onClick={() => updateRole(user.id, 'USER')} className="text-[#93000a] hover:text-[#690005] text-[0.65rem] tracking-widest uppercase font-semibold transition-colors">
                      Revoke
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
