import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Crown, ArrowUpRight, ArrowDownLeft, Star, Sparkles, CreditCard, Clock, ChevronRight, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as walletService from '../services/walletService';
import { toast } from 'sonner';
import { useLocalization } from '../context/LocalizationContext';

export default function WalletPage() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { formatPrice } = useLocalization();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vipLoading, setVipLoading] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchWallet();
  }, [user]);

  const fetchWallet = async () => {
    try {
      const data = await walletService.getWallet();
      setWallet(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Removed handleTopUp and quickAmounts as they are moved to a separate page

  const handlePurchaseVip = async () => {
    try {
      setVipLoading(true);
      await walletService.purchaseVip();
      await refreshProfile();
      await fetchWallet();
      toast.success('🎉 Congratulations! You are now a VIP member!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setVipLoading(false);
    }
  };

  const txnIcon = (type) => {
    switch (type) {
      case 'TOPUP': return <ArrowDownLeft className="text-emerald-500" size={18} />;
      case 'PAYMENT': return <ArrowUpRight className="text-red-400" size={18} />;
      case 'VIP_PURCHASE': return <Crown className="text-amber-500" size={18} />;
      case 'REFUND': return <ArrowDownLeft className="text-blue-500" size={18} />;
      default: return <CreditCard size={18} />;
    }
  };

  const txnLabel = (type) => {
    switch (type) {
      case 'TOPUP': return 'Top Up';
      case 'PAYMENT': return 'Payment';
      case 'VIP_PURCHASE': return 'VIP Purchase';
      case 'REFUND': return 'Refund';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffcf9] flex items-center justify-center mt-16">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-t-2 border-[#703225] rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcf9] mt-16 pb-20 font-['Plus_Jakarta_Sans']">
      {/* Hero */}
      <section className="relative bg-[#221a0c] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#703225] to-transparent" />
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#c8a35a]/10 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Balance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="w-full md:w-96 bg-gradient-to-br from-[#703225] to-[#4a1a10] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <Wallet size={20} />
                    </div>
                    <span className="text-sm font-medium text-white/70">Élitan Wallet</span>
                  </div>
                  {wallet?.vip && (
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#c8a35a] to-[#e8c968] px-3 py-1 rounded-full">
                      <Crown size={12} className="text-[#221a0c]" />
                      <span className="text-[10px] font-black text-[#221a0c] uppercase tracking-wider">VIP</span>
                    </div>
                  )}
                </div>

                <p className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                  ${wallet?.balance?.toFixed(2) || '0.00'}
                </p>
                <p className="text-sm text-white/50">{user?.fullName}</p>

                {wallet?.vip && wallet?.vipExpiresAt && (
                  <div className="mt-4 flex items-center gap-2 text-[11px] text-white/60">
                    <Clock size={12} />
                    <span>VIP expires: {new Date(wallet.vipExpiresAt).toLocaleDateString('en-US')}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="flex-1 text-white">
              <h1 className="text-3xl md:text-4xl font-serif mb-3">Digital Wallet</h1>
              <p className="text-[#b8a99a] text-sm mb-6 max-w-md">
                Top up your wallet, pay instantly when purchasing, and upgrade to VIP for exclusive products.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate('/wallet/topup')} className="inline-flex items-center gap-2 bg-[#c8a35a] hover:bg-[#b08e4d] text-[#221a0c] px-6 py-3 rounded-full text-sm font-bold transition-all">
                  <ArrowDownLeft size={16} /> Top Up
                </button>
                {!wallet?.vip && (
                  <a href="#vip" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-sm font-bold transition-all border border-white/10">
                    <Crown size={16} /> Upgrade VIP
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">


        {/* VIP Membership */}
        {!wallet?.vip && (
          <motion.section id="vip" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative bg-[#221a0c] rounded-3xl p-10 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#c8a35a]/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#703225]/20 rounded-full blur-[60px]" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-[#c8a35a] to-[#e8c968] p-3 rounded-2xl">
                    <Crown size={28} className="text-[#221a0c]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif">VIP Membership</h2>
                    <p className="text-[#b8a99a] text-sm">Experience 30 days of exclusive perks</p>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  {[
                    'Access to VIP Exclusive products',
                    'Priority fast shipping',
                    'Priority customer support',
                    'VIP Badge on profile'
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#c8a35a]/10 rounded-full flex items-center justify-center">
                        <Sparkles size={12} className="text-[#c8a35a]" />
                      </div>
                      <span className="text-sm text-[#b8a99a]">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-80 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <p className="text-[10px] uppercase tracking-widest text-[#c8a35a] font-bold mb-2">Only</p>
                <p className="text-5xl font-bold mb-1">$10</p>
                <p className="text-sm text-white/50 mb-6">/ 30 days</p>

                <button
                  onClick={handlePurchaseVip}
                  disabled={vipLoading || (wallet?.balance || 0) < 10}
                  className="w-full h-14 bg-gradient-to-r from-[#c8a35a] to-[#e8c968] hover:from-[#b08e4d] hover:to-[#d4b85a] text-[#221a0c] font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-[#c8a35a]/20"
                >
                  {vipLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-5 h-5 border-2 border-[#221a0c] border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Crown size={18} /> Upgrade VIP Now
                    </>
                  )}
                </button>

                {(wallet?.balance || 0) < 10 && (
                  <p className="text-[11px] text-red-400 mt-3">
                    Insufficient balance. Minimum $10.00 required.
                  </p>
                )}

                <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-white/40">
                  <Shield size={10} /> Secure payment from wallet
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Transaction History */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 border border-[#fcecd5] shadow-sm">
          <h2 className="text-2xl font-serif text-[#221a0c] mb-6">Transaction History</h2>

          {wallet?.transactions?.length === 0 ? (
            <div className="text-center py-16 text-[#86736f]">
              <Wallet size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-serif italic text-lg">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {wallet?.transactions?.map((txn) => (
                <div key={txn.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#fffcf9] border border-[#fcecd5] hover:bg-white transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#fcecd5] flex items-center justify-center">
                      {txnIcon(txn.type)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#221a0c]">{txnLabel(txn.type)}</p>
                      <p className="text-xs text-[#86736f]">{txn.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${txn.amount >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {txn.amount >= 0 ? '+' : ''}{formatPrice(Math.abs(txn.amount))}
                    </p>
                    <p className="text-[10px] text-[#86736f]">
                      {new Date(txn.createdAt).toLocaleDateString('en-US')} {new Date(txn.createdAt).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
}
