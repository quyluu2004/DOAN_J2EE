import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, ChevronLeft, MapPin, Search, Calendar, FileText } from 'lucide-react';
import * as orderService from '../services/orderService';
import { toast } from 'sonner';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await orderService.getOrderDetails(id);
                setOrder(data);
            } catch (err) {
                toast.error(err.message || "Không thể tải chi tiết đơn hàng");
                navigate('/orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, navigate]);

    const handleCancelOrder = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;

        try {
            const data = await orderService.cancelOrder(id);
            setOrder(data);
            toast.success("Hủy đơn hàng thành công");
        } catch (err) {
            toast.error(err.message || "Hủy đơn hàng thất bại");
        }
    };

    if (loading) return <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">Loading...</div>;
    if (!order) return null;

    const timelineSteps = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED'];
    const currentStepIndex = timelineSteps.indexOf(order.status);
    const isCancelled = order.status === 'CANCELLED';

    return (
        <div className="font-['Plus_Jakarta_Sans'] bg-[#F5F5F7] min-h-screen pb-20 pt-24">
            <div className="max-w-5xl mx-auto px-6">

                {/* Back Link */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition mb-8">
                    <ChevronLeft size={16} /> Back to Orders
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Order {order.trackingNumber}</h1>
                        <p className="text-gray-500 mt-2">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    {/* Status Badge */}
                    <div className={`px-5 py-2 rounded-full text-sm font-bold font-mono tracking-wide border shadow-sm ${isCancelled ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
                        }`}>
                        {order.status}
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Tracking Timeline */}
                    {!isCancelled && (
                        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-sm relative overflow-hidden">
                            <h2 className="text-lg font-bold text-gray-900 mb-8">Delivery Status</h2>

                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute top-6 left-0 w-full h-1 bg-gray-100 rounded-full" />
                                <div
                                    className="absolute top-6 left-0 h-1 bg-black rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.max(0, currentStepIndex) * 25}%` }}
                                />

                                {/* Step nodes */}
                                <div className="relative flex justify-between items-start">
                                    {[
                                        { title: 'Order Placed', icon: FileText, delay: 0 },
                                        { title: 'Confirmed', icon: CheckCircle, delay: 100 },
                                        { title: 'Preparing', icon: Package, delay: 200 },
                                        { title: 'Shipping', icon: Truck, delay: 300 },
                                        { title: 'Delivered', icon: MapPin, delay: 400 },
                                    ].map((step, idx) => {
                                        const isCompleted = currentStepIndex >= idx;
                                        const isActive = currentStepIndex === idx;
                                        const Icon = step.icon;

                                        return (
                                            <div key={idx} className="flex flex-col items-center group relative w-20">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-500 shadow-sm ${isCompleted ? 'bg-black text-white outline outline-4 outline-white' : 'bg-gray-100 text-gray-400 outline outline-4 outline-white'
                                                    } ${isActive ? 'scale-110 shadow-lg' : ''}`}>
                                                    <Icon size={isCompleted ? 20 : 18} />
                                                </div>
                                                <p className={`text-xs font-semibold text-center mt-4 transition-colors ${isCompleted ? 'text-black' : 'text-gray-400'
                                                    }`}>
                                                    {step.title}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Items in this order</h2>
                                <div className="space-y-6">
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex gap-6 group">
                                            <div className="w-24 h-28 bg-[#F8F9FA] rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                                <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover mix-blend-multiply" />
                                            </div>
                                            <div className="flex-1 py-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                                                    <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                                                        {item.color && <span>{item.color}</span>}
                                                        {item.color && item.material && <span>•</span>}
                                                        {item.material && <span>{item.material}</span>}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-end mt-4">
                                                    <div className="text-sm text-gray-500">Qty: {item.quantity}  ×  ${item.priceAtPurchase.toLocaleString()}</div>
                                                    <div className="font-semibold text-gray-900">${item.itemTotal.toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {order.status === 'PENDING' && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleCancelOrder}
                                        className="px-6 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition"
                                    >
                                        Cancel Order
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right: Summary & Info */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Subtotal</span>
                                        <span className="text-gray-900">${(order.totalPrice - order.shippingFee).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Shipping ({order.shippingMethod === 'STANDARD' ? 'Standard' : 'White Glove'})</span>
                                        <span className="text-gray-900">${order.shippingFee.toLocaleString()}</span>
                                    </div>

                                    {order.depositAmount > 0 && (
                                        <div className="flex justify-between text-yellow-600 pt-2 font-medium">
                                            <span>Deposit Paid (30%)</span>
                                            <span>${order.depositAmount.toLocaleString()}</span>
                                        </div>
                                    )}

                                    <div className="h-px bg-gray-100 my-4" />

                                    <div className="flex justify-between items-end">
                                        <span className="font-semibold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold tracking-tight text-gray-900">${order.totalPrice.toLocaleString()}</span>
                                    </div>

                                    {order.depositAmount > 0 && (
                                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mt-4">
                                            <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">Remaining Balance</span>
                                            <span className="font-bold text-gray-900">${(order.totalPrice - order.depositAmount).toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Shipping Details</h2>
                                <div className="space-y-4 text-sm text-gray-700">
                                    <div>
                                        <p className="font-medium text-gray-900">Contact</p>
                                        <p>{order.shippingName}</p>
                                        <p>{order.shippingPhone}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Address</p>
                                        <p className="leading-relaxed">{order.shippingAddress}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
