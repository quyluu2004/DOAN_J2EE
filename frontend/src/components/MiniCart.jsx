import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MiniCart = () => {
    const { cart, isCartOpen, closeCart, updateQuantity, removeItem, loading } = useCart();
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        closeCart();
        navigate('/checkout');
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-white z-[101] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out font-['Plus_Jakarta_Sans']">
                {/* Header */}
                <div className="flex items-start justify-between px-8 py-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-[28px] font-serif tracking-tight text-gray-900 leading-none mb-2">Your Selection</h2>
                        <p className="text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">Luxury Pieces Curated For You</p>
                    </div>
                    <button
                        onClick={closeCart}
                        className="text-gray-400 hover:text-black transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6">
                    {cart.items?.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-900 font-medium font-serif text-lg">Your selection is empty</p>
                                <p className="text-gray-500 text-sm mt-1">Start adding some items to your cart!</p>
                            </div>
                            <button
                                onClick={closeCart}
                                className="mt-4 px-8 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8 flex flex-col min-h-full">
                            <div className="space-y-8 flex-1">
                                {cart.items?.map((item) => (
                                    <div key={item.id} className="flex gap-6 group">
                                        {/* Product Image */}
                                        <div className="w-20 h-24 bg-[#F8F9FA] flex-shrink-0 relative">
                                            <img
                                                src={item.thumbnailUrl || item.imageUrl || "https://placehold.co/100x120/f8f9fa/d1d5db?text=Image"}
                                                alt={item.name}
                                                className="w-full h-full object-cover object-center mix-blend-multiply"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex flex-col justify-between flex-1 py-0.5">
                                            <div>
                                                <div className="flex justify-between items-start gap-2 mb-1">
                                                    <h3 className="text-base font-serif font-medium text-gray-900 line-clamp-2 leading-tight">{item.name}</h3>
                                                    <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                                        ${item.price.toLocaleString()}
                                                    </p>
                                                </div>

                                                {/* Properties */}
                                                <div className="flex flex-col gap-0.5 mt-2">
                                                    {item.color && (
                                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                                                            COLOR: <span className="text-gray-600 font-medium">{item.color}</span>
                                                        </div>
                                                    )}
                                                    {item.material && (
                                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                                                            MATERIAL: <span className="text-gray-600 font-medium">{item.material}</span>
                                                        </div>
                                                    )}
                                                    {item.dimensions && (
                                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mt-1 italic">
                                                            {item.dimensions}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-end justify-between mt-4">
                                                {/* Quantity Control */}
                                                <div className="flex items-center border border-gray-200 h-8 rounded-sm overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="w-7 h-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
                                                        disabled={loading}
                                                    >
                                                        <Minus size={12} strokeWidth={3} />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-semibold text-gray-900">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-7 h-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
                                                        disabled={loading}
                                                    >
                                                        <Plus size={12} strokeWidth={3} />
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-[10px] font-bold uppercase tracking-widest text-[#E63946] hover:text-red-700 transition-colors"
                                                    disabled={loading}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Elitan Studio Callout */}
                            <div className="mt-8 border border-blue-100 bg-[#F8FAFC] p-6 rounded-[1.5rem]">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="text-[#1E40AF]">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                    </div>
                                    <span className="text-[10px] font-bold text-[#1E40AF] tracking-[0.15em] uppercase">Élitan Studio</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">Complete the look with professional room styling.</p>
                                <button className="w-full bg-[#1E40AF] hover:bg-[#1e3a8a] text-white py-3 px-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                    Add Entire 3D Room Studio
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart.items?.length > 0 && (
                    <div className="border-t border-gray-100 p-8 pt-6 bg-white shrink-0">
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-semibold text-gray-900">${cart.subTotal?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Shipping</span>
                                <span className="text-[#1E40AF] italic font-medium">Included</span>
                            </div>
                            <div className="flex justify-between items-end pt-4 mt-2 border-t border-gray-100">
                                <span className="text-base font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-serif font-bold text-gray-900">
                                    ${cart.subTotal?.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full h-14 bg-[#0A0A0B] text-white flex items-center justify-center px-6 hover:bg-black transition-colors"
                        >
                            <span className="font-bold tracking-widest text-xs uppercase text-center w-full">Proceed to Checkout</span>
                        </button>

                        <div className="flex items-center justify-center gap-2 mt-4 text-[#1E40AF]">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="m9 12 2 2 4-4"></path></svg>
                            <p className="text-[9px] font-bold tracking-widest uppercase">
                                White-Glove Delivery Guaranteed
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MiniCart;
