import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ChevronRight, CheckCircle, CreditCard, Landmark, Banknote } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as walletService from '../services/walletService';
import { toast } from 'sonner';

export default function WalletTopUp() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleNextStep = (step) => {
    if (step === 2) {
      const amt = parseInt(amount);
      if (!amt || amt < 10000 || amt > 50000000) {
        toast.error('Please enter an amount between 10,000 and 50,000,000 VND');
        return;
      }
    }
    setActiveStep(step);
  };

  const handleTopUpSubmit = async (method) => {
    const amt = parseInt(amount);

    try {
      setLoading(true);
      if (method === 'MOMO') {
        const res = await walletService.topUpViaMomo(amt);
        if (res.success && res.payUrl) {
          toast.success('Redirecting to MoMo...');
          window.location.href = res.payUrl;
        } else {
          toast.error(res.message || 'Could not generate payment link');
          setLoading(false);
        }
      } else if (method === 'CASH') {
        // Mock Cash/Bank Transfer Flow
        setTimeout(() => {
          setLoading(false);
          toast.success('Top-up request sent to admin for cash processing!');
          navigate('/wallet/topup-return?resultCode=0&amount=' + amt);
        }, 1500);
      }
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] mt-16 pb-20 font-sans">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-10">
          <button onClick={() => navigate('/wallet')} className="text-sm font-medium text-gray-500 hover:text-black">
            Wallet
          </button>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-sm font-bold text-gray-900">Top Up</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-10 text-gray-900">Top Up Wallet</h1>

        <div className="space-y-8">
          {/* STEP 1: AMOUNT */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${activeStep >= 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
                <h2 className={`text-xl font-semibold tracking-tight ${activeStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Enter Amount</h2>
              </div>
              {activeStep > 1 && (
                <button onClick={() => setActiveStep(1)} className="text-sm font-medium text-gray-500 hover:text-black transition">Edit</button>
              )}
            </div>

            {activeStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <p className="text-sm text-gray-600 mb-4">Select or enter the amount you wish to add to your wallet (VND).</p>
                
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                  {quickAmounts.map((amt) => (
                    <button key={amt}
                      onClick={() => setAmount(String(amt))}
                      className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border-2 ${
                        amount === String(amt)
                          ? 'border-black bg-black text-white'
                          : 'border-gray-100 bg-gray-50 text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      {(amt / 1000).toLocaleString()}K
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Custom Amount (VND)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount..."
                    className="w-full h-14 bg-[#F8F9FA] border border-gray-200 rounded-xl px-6 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                  />
                </div>

                <div className="pt-4">
                  <button onClick={() => handleNextStep(2)} className="w-full h-14 bg-black text-white rounded-xl font-medium tracking-wide hover:bg-gray-900 transition flex items-center justify-center gap-2">
                    Continue to Payment <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
            {activeStep > 1 && (
              <div className="pl-12 text-lg font-bold text-gray-900 font-mono">
                {parseInt(amount).toLocaleString()} VND
              </div>
            )}
          </div>

          {/* STEP 2: PAYMENT METHOD */}
          <div className={`bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all ${activeStep < 2 ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${activeStep >= 2 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
                <h2 className={`text-xl font-semibold tracking-tight ${activeStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Payment Method</h2>
              </div>
            </div>

            {activeStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <button 
                  type="button"
                  disabled={loading}
                  onClick={() => handleTopUpSubmit('MOMO')}
                  className="w-full text-left block relative p-4 rounded-2xl border-2 cursor-pointer transition-all border-[#ae2070] bg-[#ae2070] hover:bg-[#8f1a5c] shadow-md shadow-pink-500/20 disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <CreditCard size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg leading-tight">Pay with MoMo</p>
                      <p className="text-xs text-white/80 mt-1">Instant top-up via local e-wallet</p>
                    </div>
                  </div>
                </button>

                <button 
                  type="button"
                  disabled={loading}
                  onClick={() => handleTopUpSubmit('CASH')}
                  className="w-full text-left block relative p-4 rounded-2xl border-2 cursor-pointer transition-all border-black bg-black hover:bg-gray-900 shadow-md disabled:opacity-50 mt-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Banknote size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg leading-tight">Cash Deposit</p>
                      <p className="text-xs text-white/80 mt-1">Pay with cash at our store location</p>
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
