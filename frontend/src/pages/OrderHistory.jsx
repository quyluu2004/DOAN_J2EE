import React, { useState, useEffect } from 'react';
import { Package, Truck, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as orderService from '../services/orderService';
import { toast } from 'sonner';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getMyOrders();
                setOrders(data);
            } catch (err) {
                toast.error(err.message || "Không thể tải danh sách đơn hàng");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'CONFIRMED': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'PREPARING': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            case 'SHIPPING': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'DELIVERED': return 'bg-green-50 text-green-700 border-green-200';
            case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="font-['Plus_Jakarta_Sans'] bg-[#F5F5F7] min-h-screen pb-20 pt-24">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Order History</h1>
                        <p className="text-gray-500 mt-2">View and track your previous purchases</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package size={32} className="text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven't placed any orders. Start exploring our collections to find something you'll love.</p>
                        <button onClick={() => navigate('/')} className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition shadow-lg">
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-[2rem] border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row justify-between gap-6">

                                    {/* Order Info */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-lg font-bold text-gray-900">{order.trackingNumber}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide border ${getStatusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500 space-y-1">
                                            <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                            <p>{order.items.length} items • ${order.totalPrice.toLocaleString()}</p>
                                        </div>

                                        {/* Thumbnails */}
                                        <div className="flex items-center gap-3 pt-2">
                                            {order.items.slice(0, 4).map((item, idx) => (
                                                <div key={idx} className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover mix-blend-multiply" />
                                                </div>
                                            ))}
                                            {order.items.length > 4 && (
                                                <div className="w-14 h-14 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                                                    +{order.items.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col justify-center gap-3 w-full md:w-auto">
                                        <button
                                            onClick={() => navigate(`/orders/${order.id}`)}
                                            className="w-full md:w-40 px-6 py-3 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-900 transition flex items-center justify-center gap-2"
                                        >
                                            View Details <ChevronRight size={16} />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/orders/${order.id}`)}
                                            className="w-full md:w-40 px-6 py-3 bg-white text-black text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                                        >
                                            Track Order
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
