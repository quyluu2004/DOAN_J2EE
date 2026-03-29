import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { SplitText } from '../../components/ui/ReactBits';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/orders/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const ORDER_STAGES = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED'];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'CONFIRMED': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'PREPARING': return <Package className="w-4 h-4 text-orange-500" />;
      case 'SHIPPING': return <Truck className="w-4 h-4 text-purple-500" />;
      case 'DELIVERED': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'CANCELLED': return <Package className="w-4 h-4 text-red-500" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-red-50 text-red-700 border-red-100';
      case 'CONFIRMED': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'PREPARING': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'SHIPPING': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'DELIVERED': return 'bg-green-50 text-green-700 border-green-100';
      case 'CANCELLED': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const getNextStatus = (currentStatus) => {
    const currentIndex = ORDER_STAGES.indexOf(currentStatus);
    if (currentIndex >= 0 && currentIndex < ORDER_STAGES.length - 1) {
      return ORDER_STAGES[currentIndex + 1];
    }
    return null;
  };

  const getStatusActionLabel = (nextStatus) => {
    switch (nextStatus) {
      case 'CONFIRMED': return 'Confirm';
      case 'PREPARING': return 'Prepare';
      case 'SHIPPING': return 'Ship';
      case 'DELIVERED': return 'Deliver';
      default: return 'Advance';
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
            Logistics
          </motion.p>
          <h1 className="text-5xl font-serif tracking-wide text-[#121212]">
            <SplitText text="Client Orders" />
          </h1>
        </div>
      </div>

      <div className="space-y-4">
        {/* Header Row */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 text-[#777777] font-semibold text-[0.65rem] tracking-widest uppercase border-b border-[#e2e2e2]">
          <div className="col-span-3">Reference</div>
          <div className="col-span-3">Client</div>
          <div className="col-span-2">Stage</div>
          <div className="col-span-2 text-right">Volume</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Loading / Empty States */}
        {loading ? (
          <div className="px-8 py-20 text-center text-[#777777] uppercase tracking-widest text-[0.65rem] animate-pulse">Loading records...</div>
        ) : orders.length === 0 ? (
          <div className="px-8 py-20 text-center text-[#777777] uppercase tracking-widest text-[0.65rem]">No active logistics.</div>
        ) : (
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div
                layout
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05, type: 'spring', stiffness: 200, damping: 25 }}
                className="bg-white border border-[#e2e2e2] hover:border-[#775a19] transition-colors p-6 md:p-8 flex flex-col md:grid md:grid-cols-12 gap-6 items-start md:items-center group"
              >
                {/* Reference */}
                <div className="col-span-3 w-full">
                  <p className="text-[0.65rem] text-[#777777] uppercase tracking-widest mb-1 md:hidden">Reference</p>
                  <div className="font-mono text-sm text-[#121212] tracking-wider">{order.trackingNumber}</div>
                  <div className="text-[#a0a0a0] font-mono text-[0.65rem] mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>

                {/* Client */}
                <div className="col-span-3 w-full">
                  <p className="text-[0.65rem] text-[#777777] uppercase tracking-widest mb-1 md:hidden">Client</p>
                  <div className="text-[#121212] font-serif text-lg leading-none">{order.shippingName}</div>
                </div>

                {/* Stage */}
                <div className="col-span-2 w-full">
                  <p className="text-[0.65rem] text-[#777777] uppercase tracking-widest mb-1 md:hidden">Stage</p>
                  <div className={`inline-flex items-center space-x-2 px-3 py-1.5 border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="text-[0.65rem] font-semibold tracking-widest uppercase">{order.status}</span>
                  </div>
                </div>

                {/* Volume */}
                <div className="col-span-2 w-full md:text-right">
                  <p className="text-[0.65rem] text-[#777777] uppercase tracking-widest mb-1 md:hidden">Volume</p>
                  <div className="font-serif text-xl text-[#121212]">${order.totalPrice.toFixed(2)}</div>
                </div>

                {/* Actions */}
                <div className="col-span-2 w-full flex md:justify-end items-center gap-4 pt-4 md:pt-0 border-t border-[#e2e2e2] md:border-none mt-4 md:mt-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  {getNextStatus(order.status) && (
                    <button 
                      onClick={() => updateStatus(order.id, getNextStatus(order.status))} 
                      className="text-[#90702e] hover:text-[#4f3700] text-[0.65rem] tracking-widest uppercase font-bold transition-colors border border-[#90702e] px-2 py-1 rounded hover:bg-[#90702e] hover:text-white"
                    >
                      {getStatusActionLabel(getNextStatus(order.status))}
                    </button>
                  )}
                  {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                    <button 
                      onClick={() => {
                        if(window.confirm("Cancel this order?")) {
                          updateStatus(order.id, 'CANCELLED');
                        }
                      }} 
                      className="text-red-600 hover:text-red-800 text-[0.65rem] tracking-widest uppercase font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  {order.status === 'DELIVERED' && (
                    <span className="text-[#a0a0a0] text-[0.65rem] tracking-widest uppercase font-semibold">Archived</span>
                  )}
                  {order.status === 'CANCELLED' && (
                    <span className="text-red-400 text-[0.65rem] tracking-widest uppercase font-semibold">Cancelled</span>
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
