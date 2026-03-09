import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, MapPin, Truck, CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import * as orderService from '../services/orderService';
import { toast } from 'sonner';

const Checkout = () => {
    const { cart, clearCartLocal, fetchCart } = useCart();
    const navigate = useNavigate();

    const [activeStep, setActiveStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        shippingName: '',
        shippingPhone: '',
        shippingAddress: '',
        shippingMethod: 'STANDARD', // STANDARD or WHITE_GLOVE
        paymentMethod: 'COD', // COD, VNPAY, STRIPE
        note: '' // Can include DEPOSIT_30
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNextStep = (step) => {
        if (step === 2 && (!formData.shippingName || !formData.shippingPhone || !formData.shippingAddress)) {
            toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
            return;
        }
        setActiveStep(step);
    };

    const handlePlaceOrder = async () => {
        if (!formData.paymentMethod) {
            toast.error('Vui lòng chọn phương thức thanh toán');
            return;
        }

        try {
            setLoading(true);
            const orderData = { ...formData };
            const res = await orderService.createOrder(orderData);

            toast.success('Đặt hàng thành công!');
            clearCartLocal();
            navigate(`/orders/${res.id}`); // Redirect to order details
        } catch (err) {
            toast.error(err.message || 'Có lỗi xảy ra khi đặt hàng');
        } finally {
            setLoading(false);
        }
    };

    // If cart is empty, redirect
    if (!cart?.items?.length) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6">
                <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
                <button onClick={() => navigate('/')} className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-900 transition font-medium">
                    Tiếp tục mua sắm
                </button>
            </div>
        );
    }

    const shippingFee = formData.shippingMethod === 'WHITE_GLOVE' ? 150 : (cart.subTotal < 500 ? 30 : 0);
    const total = cart.subTotal + shippingFee;

    return (
        <div className="font-['Plus_Jakarta_Sans'] bg-[#F8F9FA] min-h-screen pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 py-6 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
                    <button onClick={() => navigate('/')} className="text-2xl font-bold tracking-tighter">ÉLITAN</button>
                    <div className="flex items-center gap-2 text-sm text-green-700 font-medium bg-green-50 px-4 py-2 rounded-full">
                        <ShieldCheck size={16} />
                        <span>Secure Checkout</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-12">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

                    {/* Main Checkout Flow */}
                    <div className="flex-1 lg:max-w-3xl">
                        <h1 className="text-3xl font-bold tracking-tight mb-10 text-gray-900">Checkout</h1>

                        <div className="space-y-8">
                            {/* STEP 1: SHIPPING INFO */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${activeStep >= 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
                                        <h2 className={`text-xl font-semibold tracking-tight ${activeStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Contact & Shipping</h2>
                                    </div>
                                    {activeStep > 1 && (
                                        <button onClick={() => setActiveStep(1)} className="text-sm font-medium text-gray-500 hover:text-black transition">Edit</button>
                                    )}
                                </div>

                                {activeStep === 1 && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                                <input type="text" name="shippingName" value={formData.shippingName} onChange={handleInputChange} className="w-full h-12 bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all" placeholder="Enter your full name" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                                <input type="tel" name="shippingPhone" value={formData.shippingPhone} onChange={handleInputChange} className="w-full h-12 bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all" placeholder="+84" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Detailed Address</label>
                                            <input type="text" name="shippingAddress" value={formData.shippingAddress} onChange={handleInputChange} className="w-full h-12 bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all" placeholder="House number, Street, Ward, District, City" />
                                        </div>

                                        <div className="pt-4">
                                            <button onClick={() => handleNextStep(2)} className="w-full h-14 bg-black text-white rounded-xl font-medium tracking-wide hover:bg-gray-900 transition shadow-lg shadow-black/10 flex items-center justify-center gap-2">
                                                Continue to Delivery <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {activeStep > 1 && (
                                    <div className="pl-12 text-sm text-gray-600">
                                        <p className="font-medium text-gray-900">{formData.shippingName} · {formData.shippingPhone}</p>
                                        <p className="mt-1">{formData.shippingAddress}</p>
                                    </div>
                                )}
                            </div>


                            {/* STEP 2: SHIPPING METHOD */}
                            <div className={`bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all ${activeStep < 2 ? 'opacity-60' : ''}`}>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${activeStep >= 2 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
                                        <h2 className={`text-xl font-semibold tracking-tight ${activeStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Delivery Method</h2>
                                    </div>
                                    {activeStep > 2 && (
                                        <button onClick={() => setActiveStep(2)} className="text-sm font-medium text-gray-500 hover:text-black transition">Edit</button>
                                    )}
                                </div>

                                {activeStep === 2 && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <label className={`block relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.shippingMethod === 'STANDARD' ? 'border-black bg-gray-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                                            <input type="radio" name="shippingMethod" value="STANDARD" checked={formData.shippingMethod === 'STANDARD'} onChange={handleInputChange} className="sr-only" />
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.shippingMethod === 'STANDARD' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                        <Truck size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">Standard Delivery</p>
                                                        <p className="text-sm text-gray-500 mt-1">3-5 business days. Threshold drop-off.</p>
                                                    </div>
                                                </div>
                                                <span className="font-semibold text-gray-900">{cart.subTotal >= 500 ? 'Free' : '$30.00'}</span>
                                            </div>
                                            {formData.shippingMethod === 'STANDARD' && <div className="absolute top-5 right-5 text-black"><CheckCircle size={24} /></div>}
                                        </label>

                                        <label className={`block relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.shippingMethod === 'WHITE_GLOVE' ? 'border-black bg-gray-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                                            <input type="radio" name="shippingMethod" value="WHITE_GLOVE" checked={formData.shippingMethod === 'WHITE_GLOVE'} onChange={handleInputChange} className="sr-only" />
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.shippingMethod === 'WHITE_GLOVE' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                        <MapPin size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">White Glove Premium</p>
                                                        <p className="text-sm text-gray-500 mt-1">Scheduled delivery, assembly, and debris removal.</p>
                                                    </div>
                                                </div>
                                                <span className="font-semibold text-gray-900">$150.00</span>
                                            </div>
                                            {formData.shippingMethod === 'WHITE_GLOVE' && <div className="absolute top-5 right-5 text-black"><CheckCircle size={24} /></div>}
                                        </label>

                                        <div className="pt-6">
                                            <button onClick={() => handleNextStep(3)} className="w-full h-14 bg-black text-white rounded-xl font-medium tracking-wide hover:bg-gray-900 transition shadow-lg shadow-black/10 flex items-center justify-center gap-2">
                                                Continue to Payment <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {activeStep > 2 && (
                                    <div className="pl-12 flex justify-between items-center text-sm font-medium text-gray-900">
                                        <span>{formData.shippingMethod === 'STANDARD' ? 'Standard Delivery' : 'White Glove Premium'}</span>
                                        <span>{formData.shippingMethod === 'STANDARD' ? (cart.subTotal >= 500 ? 'Free' : '$30.00') : '$150.00'}</span>
                                    </div>
                                )}
                            </div>


                            {/* STEP 3: PAYMENT */}
                            <div className={`bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all ${activeStep < 3 ? 'opacity-60' : ''}`}>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${activeStep === 3 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>3</div>
                                    <h2 className={`text-xl font-semibold tracking-tight ${activeStep === 3 ? 'text-gray-900' : 'text-gray-400'}`}>Payment</h2>
                                </div>

                                {activeStep === 3 && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <label className={`block relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'COD' ? 'border-black bg-gray-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                                            <input type="radio" name="paymentMethod" value="COD" checked={formData.paymentMethod === 'COD'} onChange={handleInputChange} className="sr-only" />
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.paymentMethod === 'COD' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                    <Truck size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Cash on Delivery (COD)</p>
                                                    <p className="text-sm text-gray-500 mt-1">Pay when you receive your order.</p>
                                                </div>
                                            </div>
                                            {formData.paymentMethod === 'COD' && <div className="absolute top-5 right-5 text-black"><CheckCircle size={24} /></div>}
                                        </label>

                                        {/* Additional Note / Deposit option */}
                                        <div className="pt-6">
                                            <label className="flex items-center gap-3 p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl cursor-pointer">
                                                <input type="checkbox" onChange={(e) => {
                                                    setFormData(prev => ({ ...prev, note: e.target.checked ? 'DEPOSIT_30' : '' }))
                                                }} className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Pay 30% Deposit Now</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">Pay the remaining balance (${(total * 0.7).toLocaleString()}) upon delivery.</p>
                                                </div>
                                            </label>
                                        </div>

                                        <div className="pt-8">
                                            <button onClick={handlePlaceOrder} disabled={loading} className="w-full h-14 bg-black text-white rounded-xl text-lg font-medium tracking-wide hover:bg-gray-900 transition shadow-xl shadow-black/20 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed">
                                                {loading ? 'Processing...' : `Pay $${(formData.note === 'DEPOSIT_30' ? total * 0.3 : total).toLocaleString()}`}
                                            </button>
                                            <p className="text-center flex justify-center items-center gap-1.5 text-xs text-gray-400 mt-4">
                                                <ShieldCheck size={14} /> Payments are secure and encrypted
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Sidebar / Order Summary */}
                    <div className="lg:w-[420px] shrink-0">
                        <div className="sticky top-32">
                            <div className="bg-[#111827] text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                                {/* Background Pattern */}
                                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

                                <h2 className="text-xl font-semibold mb-8 tracking-tight flex items-center justify-between">
                                    Order Summary
                                    <span className="text-sm font-medium text-gray-400 bg-white/10 px-3 py-1 rounded-full">{cart.totalItems} Items</span>
                                </h2>

                                <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {cart.items.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="w-16 h-20 bg-white/10 rounded-xl overflow-hidden shrink-0">
                                                <img src={item.thumbnailUrl || item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-90" />
                                            </div>
                                            <div className="flex-1 min-w-0 py-1">
                                                <h3 className="font-medium text-sm truncate text-white">{item.name}</h3>
                                                <p className="text-gray-400 text-xs mt-1">Qty: {item.quantity} {item.color ? `· ${item.color}` : ''}</p>
                                                <p className="font-medium text-sm mt-2">${item.itemTotal.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/10 text-sm">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="text-white">${cart.subTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Shipping</span>
                                        <span className="text-white">{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</span>
                                    </div>

                                    {formData.note === 'DEPOSIT_30' && (
                                        <div className="flex justify-between text-yellow-500 pt-2">
                                            <span>30% Deposit Amount</span>
                                            <span>${(total * 0.3).toLocaleString()}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-end pt-4 mt-2 border-t border-white/10">
                                        <span className="font-medium">Total</span>
                                        <span className="text-3xl font-bold tracking-tight">${total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Checkout;
