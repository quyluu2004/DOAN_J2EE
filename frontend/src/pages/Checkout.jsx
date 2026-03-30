import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, MapPin, Truck, CreditCard, CheckCircle, Mail, Wallet } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { useCart } from '../context/CartContext';
import * as orderService from '../services/orderService';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';
import { useMomoPayment } from '../hooks/useMomoPayment';

const Checkout = () => {
    const { user } = useAuth();
    const { cart, clearCartLocal, fetchCart } = useCart();
    const { t, formatPrice, lang } = useLocalization();
    const navigate = useNavigate();
    const { payWithMomo, isLoading: momoLoading } = useMomoPayment();

    const [activeStep, setActiveStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        shippingName: '',
        shippingPhone: '',
        paymentMethod: 'COD', // COD, VNPAY, STRIPE
        otpCode: '',
        note: '' // Can include DEPOSIT_30
    });
    const [otpSent, setOtpSent] = useState(false);
    const [otpCountdown, setOtpCountdown] = useState(0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNextStep = (step) => {
        if (step === 2 && (!formData.shippingName || !formData.shippingPhone || !formData.shippingAddress)) {
            toast.error(t('checkout.errors.shippinginfo'));
            return;
        }
        if (step === 3 && !formData.shippingMethod) {
            toast.error(t('checkout.errors.shippingmethod'));
            return;
        }
        setActiveStep(step);
    };

    const handleSendOtp = async () => {
        try {
            setLoading(true);
            await orderService.sendOtp(user?.email);
            setOtpSent(true);
            setOtpCountdown(60);
            toast.success(t('checkout.otp.sent'));
            
            // Countdown timer
            const timer = setInterval(() => {
                setOtpCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            toast.error(err.message || t('checkout.otp.fail'));
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!formData.paymentMethod) {
            toast.error(t('checkout.errors.paymentmethod'));
            return;
        }

        try {
            setLoading(true);
            const orderData = { ...formData };
            const res = await orderService.createOrder(orderData);

            // Nếu phương thức thanh toán là MoMo, redirect sang MoMo
            if (formData.paymentMethod === 'MOMO') {
                clearCartLocal();
                // Tính số tiền VND (total * tỉ giá, hoặc dùng giá trị mock cho sandbox)
                // Sandbox MoMo yêu cầu amount tối thiểu 1000 VND
                const amountInVND = Math.max(Math.round(total * 23000), 1000);
                await payWithMomo({
                    orderId: res.id,
                    amount: amountInVND,
                    orderInfo: `Thanh toán đơn hàng #${res.trackingNumber}`,
                });
                // payWithMomo sẽ tự redirect, không cần navigate
                return;
            }

            toast.success(t('checkout.success'));
            clearCartLocal();
            navigate(`/orders/${res.id}`);
        } catch (err) {
            toast.error(err.message || t('checkout.errors.generic'));
        } finally {
            setLoading(false);
        }
    };

    // If cart is empty, redirect
    if (!cart?.items?.length) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6">
                <h2 className="text-2xl font-bold mb-4">{t('cart.empty')}</h2>
                <button onClick={() => navigate('/')} className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-900 transition font-medium">
                    {t('cart.mini.continue')}
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
                        <span>{t('checkout.secure_checkout')}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-12">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

                    {/* Main Checkout Flow */}
                    <div className="flex-1 lg:max-w-3xl">
                        <h1 className="text-3xl font-bold tracking-tight mb-10 text-gray-900">{t('checkout.title')}</h1>

                        <div className="space-y-8">
                            {/* STEP 1: SHIPPING INFO */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${activeStep >= 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
                                        <h2 className={`text-xl font-semibold tracking-tight ${activeStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>{t('checkout.contact_shipping')}</h2>
                                    </div>
                                    {activeStep > 1 && (
                                        <button onClick={() => setActiveStep(1)} className="text-sm font-medium text-gray-500 hover:text-black transition">Edit</button>
                                    )}
                                </div>

                                {activeStep === 1 && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">{t('checkout.form.full_name')}</label>
                                                <input type="text" name="shippingName" value={formData.shippingName} onChange={handleInputChange} className="w-full h-12 bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all" placeholder={t('checkout.form.placeholder_name')} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">{t('checkout.form.phone')}</label>
                                                <input type="tel" name="shippingPhone" value={formData.shippingPhone} onChange={handleInputChange} className="w-full h-12 bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all" placeholder="+84" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">{t('checkout.form.address')}</label>
                                            <input type="text" name="shippingAddress" value={formData.shippingAddress} onChange={handleInputChange} className="w-full h-12 bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all" placeholder={t('checkout.form.placeholder_address')} />
                                        </div>

                                        <div className="pt-4">
                                            <button onClick={() => handleNextStep(2)} className="w-full h-14 bg-black text-white rounded-xl font-medium tracking-wide hover:bg-gray-900 transition shadow-lg shadow-black/10 flex items-center justify-center gap-2">
                                                {t('checkout.btn_continue_delivery')} <ChevronRight size={18} />
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
                                        <h2 className={`text-xl font-semibold tracking-tight ${activeStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>{t('checkout.delivery_method')}</h2>
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
                                                        <p className="font-semibold text-gray-900">{t('checkout.shipping.standard_title')}</p>
                                                        <p className="text-sm text-gray-500 mt-1">{t('checkout.shipping.standard_desc')}</p>
                                                    </div>
                                                </div>
                                                <span className="font-semibold text-gray-900">{cart.subTotal >= 500 ? t('common.free') : '$30.00'}</span>
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
                                                        <p className="font-semibold text-gray-900">{t('checkout.shipping.white_glove_title')}</p>
                                                        <p className="text-sm text-gray-500 mt-1">{t('checkout.shipping.white_glove_desc')}</p>
                                                    </div>
                                                </div>
                                                <span className="font-semibold text-gray-900">$150.00</span>
                                            </div>
                                            {formData.shippingMethod === 'WHITE_GLOVE' && <div className="absolute top-5 right-5 text-black"><CheckCircle size={24} /></div>}
                                        </label>

                                        <div className="pt-6">
                                            <button onClick={() => handleNextStep(3)} className="w-full h-14 bg-black text-white rounded-xl font-medium tracking-wide hover:bg-gray-900 transition shadow-lg shadow-black/10 flex items-center justify-center gap-2">
                                                {t('checkout.btn_continue_payment')} <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {activeStep > 2 && (
                                    <div className="pl-12 flex justify-between items-center text-sm font-medium text-gray-900">
                                        <span>{formData.shippingMethod === 'STANDARD' ? t('checkout.shipping.standard_title') : t('checkout.shipping.white_glove_title')}</span>
                                        <span>{formData.shippingMethod === 'STANDARD' ? (cart.subTotal >= 500 ? t('common.free') : '$30.00') : '$150.00'}</span>
                                    </div>
                                )}
                            </div>


                            {/* STEP 3: PAYMENT & OTP VERIFICATION */}
                            <div className={`bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all ${activeStep < 3 ? 'opacity-60' : ''}`}>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${activeStep === 3 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>3</div>
                                    <h2 className={`text-xl font-semibold tracking-tight ${activeStep === 3 ? 'text-gray-900' : 'text-gray-400'}`}>{t('checkout.review_verify')}</h2>
                                </div>

                                {activeStep === 3 && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-500">{t('checkout.payment_desc')}</p>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <label className={`block relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'COD' ? 'border-black bg-gray-50/50' : 'border-gray-100'}`}>
                                                    <input type="radio" name="paymentMethod" value="COD" checked={formData.paymentMethod === 'COD'} onChange={handleInputChange} className="sr-only" />
                                                    <div className="flex items-center gap-3">
                                                        <Truck size={16} />
                                                        <span className="font-semibold text-sm">{t('checkout.payment.cod')}</span>
                                                    </div>
                                                </label>
                                                <label className={`block relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'VNPAY' ? 'border-black bg-gray-50/50' : 'border-gray-100'}`}>
                                                    <input type="radio" name="paymentMethod" value="VNPAY" checked={formData.paymentMethod === 'VNPAY'} onChange={handleInputChange} className="sr-only" />
                                                    <div className="flex items-center gap-3">
                                                        <CreditCard size={16} />
                                                        <span className="font-semibold text-sm">{t('checkout.payment.vnpay')}</span>
                                                    </div>
                                                </label>
                                                {/* MoMo Payment Option - NEW */}
                                                <label className={`block relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'MOMO' ? 'border-[#ae2070] bg-pink-50/50' : 'border-gray-100 hover:border-pink-200'}`}>
                                                    <input type="radio" name="paymentMethod" value="MOMO" checked={formData.paymentMethod === 'MOMO'} onChange={handleInputChange} className="sr-only" />
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${formData.paymentMethod === 'MOMO' ? 'bg-[#ae2070]' : 'bg-gray-200'}`}>
                                                            <Wallet size={11} className="text-white" />
                                                        </div>
                                                        <span className={`font-semibold text-sm ${formData.paymentMethod === 'MOMO' ? 'text-[#ae2070]' : ''}`}>MoMo</span>
                                                    </div>
                                                    {formData.paymentMethod === 'MOMO' && (
                                                        <p className="text-[10px] text-[#ae2070] mt-1 pl-8">Ví điện tử MoMo (Sandbox)</p>
                                                    )}
                                                </label>
                                            </div>

                                            <div className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input type="checkbox" onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.checked ? 'DEPOSIT_30' : '' }))} className="w-5 h-5 rounded border-gray-300" />
                                                    <div className="text-sm">
                                                        <p className="font-medium text-gray-900">{t('checkout.payment.deposit_title')}</p>
                                                        <p className="text-xs text-gray-500">{t('checkout.payment.deposit_desc')}</p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <Separator className="my-6" />

                                        {/* ZALO OTP SECTION */}
                                        <div className="bg-[#f0f7ff] border border-[#d0e6ff] rounded-2xl p-6">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="bg-blue-500 p-2 rounded-lg shrink-0">
                                                    <Mail size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-[#1e3a8a]">{t('checkout.otp.header')}</h3>
                                                    <p className="text-xs text-[#3b82f6]">{t('checkout.otp.subtext').replace('{{email}}', `${user?.email?.split('@')[0].substring(0, 3)}***@${user?.email?.split('@')[1]}`)}</p>
                                                </div>
                                            </div>

                                            {!otpSent ? (
                                                <Button 
                                                    onClick={handleSendOtp} 
                                                    disabled={loading}
                                                    className="w-full bg-[#0068ff] hover:bg-[#0052cc] text-white font-bold h-12 transition-all shadow-lg shadow-blue-500/20"
                                                >
                                                    {loading ? t('common.loading') : t('checkout.otp.btn_send')}
                                                </Button>
                                            ) : (
                                                <div className="space-y-4 animate-in zoom-in-95 duration-300">
                                                    <div className="flex gap-2">
                                                        <Input 
                                                            name="otpCode"
                                                            value={formData.otpCode}
                                                            onChange={handleInputChange}
                                                            placeholder={t('checkout.otp.placeholder')}
                                                            className="text-center text-lg tracking-[0.5em] font-bold h-12 border-blue-200 focus:ring-blue-500"
                                                            maxLength={6}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-gray-500">{t('checkout.otp.no_code')}</span>
                                                        {otpCountdown > 0 ? (
                                                            <span className="text-blue-600 font-medium">{t('checkout.otp.resend_in').replace('{{time}}', otpCountdown)}</span>
                                                        ) : (
                                                            <button onClick={handleSendOtp} className="text-blue-600 font-bold hover:underline">{t('checkout.otp.resend_now')}</button>
                                                        )}
                                                    </div>
                                                    <Button 
                                                        onClick={handlePlaceOrder} 
                                                        disabled={loading || momoLoading || formData.otpCode.length < 6}
                                                        className={`w-full font-bold h-14 text-lg shadow-xl transition-all ${
                                                            formData.paymentMethod === 'MOMO'
                                                                ? 'bg-[#ae2070] hover:bg-[#8f1a5c] text-white'
                                                                : 'bg-black hover:bg-gray-900 text-white'
                                                        }`}
                                                    >
                                                        {(loading || momoLoading) ? t('common.loading') : (
                                                            formData.paymentMethod === 'MOMO'
                                                                ? `Thanh toán MoMo — ${formatPrice(formData.note === 'DEPOSIT_30' ? total * 0.3 : total)}`
                                                                : `${t('checkout.place_order')} — ${formatPrice(formData.note === 'DEPOSIT_30' ? total * 0.3 : total)}`
                                                        )}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-center flex justify-center items-center gap-1.5 text-[10px] text-gray-400 uppercase tracking-widest">
                                            <ShieldCheck size={12} /> {t('checkout.secure_info')}
                                        </p>
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
                                    {t('checkout.summary')}
                                    <span className="text-sm font-medium text-gray-400 bg-white/10 px-3 py-1 rounded-full">{cart.totalItems} {t('cart.items')}</span>
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
                                        <span>{t('cart.subtotal')}</span>
                                        <span className="text-white">{formatPrice(cart.subTotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>{t('checkout.shipping_fee')}</span>
                                        <span className="text-white">{shippingFee === 0 ? t('common.free') : formatPrice(shippingFee)}</span>
                                    </div>

                                    {formData.note === 'DEPOSIT_30' && (
                                        <div className="flex justify-between text-yellow-500 pt-2">
                                            <span>{t('checkout.deposit')}</span>
                                            <span>{formatPrice(total * 0.3)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-end pt-4 mt-2 border-t border-white/10">
                                        <span className="font-medium">{t('checkout.total')}</span>
                                        <span className="text-3xl font-bold tracking-tight">{formatPrice(total)}</span>
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
