import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SplitText, BlurText, SpotlightCard } from '../../components/ui/ReactBits';
import { getDashboardStats } from '../../services/adminService';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { AlertTriangle, TrendingUp, Users, Package, DollarSign, Eye, ShoppingCart } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await getDashboardStats();
      setData(stats);
    } catch (err) {
      console.error("Failed to load stats", err);
      setError("Không thể tải dữ liệu thống kê. Vui lòng kiểm tra lại quyền truy cập hoặc đăng nhập lại.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
         <div className="w-12 h-12 border-t-2 border-[#775a19] rounded-full animate-spin mb-4"></div>
         <p className="text-[#775a19] text-xs font-serif italic animate-pulse">Waking up the digital atelier...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center p-8 text-center">
         <AlertTriangle size={48} className="text-red-500 mb-4" />
         <h2 className="text-xl font-serif text-[#121212] mb-2">Access Denied or Connection Failed</h2>
         <p className="text-[#777] mb-6 max-w-md">{error || "Dữ liệu không khả dụng."}</p>
         <button 
           onClick={fetchStats}
           className="px-6 py-2 bg-[#121212] text-white text-[10px] uppercase tracking-widest hover:bg-[#2a2a2a] transition-colors"
         >
           Retry Request
         </button>
      </div>
    );
  }

  const COLORS = ['#703225', '#9b4d1c', '#59614d', '#37455e', '#221a0c'];

  return (
    <div className="w-full pb-20 px-4 md:px-0">
      <div className="mb-16 mt-8">
        <div className="text-[#775a19] text-xs tracking-[0.3em] font-semibold uppercase mb-6 flex overflow-hidden">
          <SplitText text="Curating luxury excellence" />
        </div>
        <h1 className="text-5xl md:text-6xl font-serif text-[#121212] leading-tight tracking-tight">
          <BlurText text="Executive Overview." delay={0.2} />
        </h1>
      </div>
      
      {/* Key Metrics */}
      <motion.div 
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-12"
        initial="hidden" animate="visible"
        variants={{
           hidden: { opacity: 0 },
           visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        <StatCard title="Website Visits" value={data.totalVisits?.toLocaleString() || '0'} icon={<Eye size={20}/>} trend="Total page views" highlight />
        <StatCard title="Completed Orders" value={data.totalCompletedOrders?.toLocaleString() || '0'} icon={<ShoppingCart size={20}/>} trend="Successful purchases" highlight />
        <StatCard title="Total Revenue" value={`$${data.totalRevenue?.toLocaleString()}`} icon={<DollarSign size={20}/>} trend="All-time earnings" />
        <StatCard title="Active Orders" value={data.activeOrders} icon={<Package size={20}/>} trend="Awaiting shipment" />
        <StatCard title="New Customers" value={data.newCustomers} icon={<Users size={20}/>} trend="This month's registrations" />
        <StatCard title="Total Products" value={data.totalProducts} icon={<TrendingUp size={20}/>} trend="Curated collection size" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
         {/* Monthly Revenue Chart */}
         <SpotlightCard className="p-8 h-[450px]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#777] mb-8">Monthly Revenue Performance</h3>
            <div className="h-[320px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.revenueData.reverse()}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#121212', border: 'none', borderRadius: '4px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                     />
                     <Line type="monotone" dataKey="revenue" stroke="#703225" strokeWidth={3} dot={{ r: 4, fill: '#703225' }} activeDot={{ r: 6 }} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </SpotlightCard>

         {/* Top Products Chart */}
         <SpotlightCard className="p-8 h-[450px]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#777] mb-8">Most Desired Pieces</h3>
            <div className="h-[320px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.topProducts}>
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} hide />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#121212', border: 'none', borderRadius: '4px', color: '#fff' }}
                     />
                     <Bar dataKey="sold" radius={[4, 4, 0, 0]} barSize={40}>
                        {data.topProducts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
               <div className="mt-4 flex flex-wrap gap-4">
                  {data.topProducts.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                       <span className="text-[10px] font-bold uppercase tracking-wider text-[#121212]">{p.name}</span>
                    </div>
                  ))}
               </div>
            </div>
         </SpotlightCard>
      </div>

      {/* Low Stock Alerts */}
      <SpotlightCard className="p-8">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#777] flex items-center gap-3">
               <AlertTriangle size={16} className="text-amber-500" />
               Inventory Attention Required
            </h3>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-3 py-1 rounded-full">{data.lowStock.length} Alerts</span>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-gray-100 text-[10px] uppercase tracking-widest text-[#999] font-bold">
                     <th className="pb-4">Piece</th>
                     <th className="pb-4">Category</th>
                     <th className="pb-4">Stock</th>
                     <th className="pb-4">Status</th>
                  </tr>
               </thead>
               <tbody className="text-sm">
                  {data.lowStock.map((product) => (
                    <tr key={product.id} className="border-b border-gray-50 last:border-0">
                       <td className="py-4 font-serif text-[#121212]">{product.name}</td>
                       <td className="py-4 text-[#777] uppercase text-[10px] tracking-wider">{product.category}</td>
                       <td className="py-4 font-bold text-[#121212]">{product.stock}</td>
                       <td className="py-4">
                          <span className={`${product.stock === 0 ? 'text-red-500 bg-red-50' : 'text-amber-600 bg-amber-50'} text-[9px] uppercase font-bold px-2 py-1 rounded-sm`}>
                             {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                          </span>
                       </td>
                    </tr>
                  ))}
                  {data.lowStock.length === 0 && (
                    <tr>
                       <td colSpan="4" className="py-12 text-center text-[#999] italic font-serif">All pieces are currently well-stocked.</td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </SpotlightCard>
    </div>
  );
}

function StatCard({ title, value, icon, trend, highlight }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
      <SpotlightCard className={`p-8 h-full ${highlight ? 'bg-[#121212] text-white' : ''}`}>
        <div className="flex justify-between items-start mb-6">
           <div className={`p-3 rounded-sm ${highlight ? 'bg-[#2a2a2a] text-[#d4a843]' : 'bg-[#f9f9f9] text-[#703225]'}`}>
              {icon}
           </div>
           <span className={`text-[10px] font-bold ${highlight ? 'text-[#d4a843]' : 'text-green-600'}`}>{trend}</span>
        </div>
        <h3 className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-2 ${highlight ? 'text-[#999]' : 'text-[#777]'}`}>{title}</h3>
        <p className={`text-3xl font-serif ${highlight ? 'text-white' : 'text-[#121212]'}`}>{value}</p>
      </SpotlightCard>
    </motion.div>
  );
}
