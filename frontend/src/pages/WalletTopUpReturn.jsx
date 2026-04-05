import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Wallet, ArrowRight } from 'lucide-react';

export default function WalletTopUpReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const processReturn = async () => {
      const resultCode = searchParams.get('resultCode');
      
      if (resultCode === '0') {
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (isLocalhost) {
          try {
            const ipnData = {};
            for (const [key, value] of searchParams.entries()) {
              ipnData[key] = value;
            }
            // Parse some fields to match MoMo IPN standard types expected by backend
            if (ipnData.resultCode) ipnData.resultCode = parseInt(ipnData.resultCode);
            if (ipnData.amount) ipnData.amount = parseInt(ipnData.amount);
            
            // Send synthetic IPN via our wallet service function
            const { syncMomoPaymentLocal } = await import('../services/walletService');
            await syncMomoPaymentLocal(ipnData);
            console.log('Localhost MoMo IPN Synced Successfully for Wallet Top Up');
          } catch (err) {
            console.error('Failed to sync MoMo IPN on localhost', err);
          }
        }
        setStatus('success');
      } else {
        setStatus('failed');
      }
    };
    
    processReturn();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#fffcf9] flex items-center justify-center mt-16 font-['Plus_Jakarta_Sans']">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-4"
      >
        {status === 'loading' && (
          <div className="text-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-t-2 border-[#703225] rounded-full mx-auto" />
            <p className="mt-4 text-[#86736f]">Processing...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white rounded-3xl p-10 border border-[#fcecd5] shadow-xl text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-emerald-600" />
            </div>
            <h1 className="text-2xl font-serif text-[#221a0c] mb-2">Top-Up Successful!</h1>
            <p className="text-sm text-[#86736f] mb-2">
              The funds have been added to your wallet.
            </p>
            <p className="text-xs text-[#86736f] mb-8">
              Amount: {searchParams.get('amount') ? `${parseInt(searchParams.get('amount')).toLocaleString()} VND` : 'N/A'}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/wallet')}
                className="w-full h-14 bg-[#703225] hover:bg-[#5a281e] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Wallet size={18} /> View Wallet
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="w-full h-12 bg-[#fcecd5] hover:bg-[#f5ddbf] text-[#703225] font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Continue Shopping <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-white rounded-3xl p-10 border border-red-100 shadow-xl text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle size={40} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-serif text-[#221a0c] mb-2">Top-Up Failed</h1>
            <p className="text-sm text-[#86736f] mb-8">
              The transaction was cancelled or an error occurred. Please try again.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/wallet')}
                className="w-full h-14 bg-[#703225] hover:bg-[#5a281e] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Wallet size={18} /> Back to Wallet
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
