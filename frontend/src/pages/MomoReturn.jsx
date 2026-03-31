import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import * as orderService from '../services/orderService';
import { useCart } from '../context/CartContext';

/**
 * Trang kết quả thanh toán MoMo.
 * MoMo redirect người dùng về đây sau khi thanh toán xong.
 * Route: /payment/momo-return
 * 
 * File mới hoàn toàn, không xung đột với bất kỳ trang nào hiện có.
 */
export default function MomoReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const { clearCartLocal } = useCart();

  useEffect(() => {
    const resultCode = searchParams.get('resultCode');
    const momoOrderId = searchParams.get('orderId');
    console.log('MoMo return params:', { resultCode, momoOrderId });

    const processReturn = async () => {
      if (resultCode === '0') {
        // 1. THANH TOÁN THÀNH CÔNG -> TẠO ĐƠN HÀNG VÀO LÚC NÀY
        const savedOrderStr = localStorage.getItem('pendingMomoOrder');
        if (savedOrderStr) {
          localStorage.removeItem('pendingMomoOrder'); // Xóa ngay để chống StrictMode double-call
          try {
            const orderData = JSON.parse(savedOrderStr);
            await orderService.createOrder(orderData);
            try { clearCartLocal(); } catch (e) {}
            setStatus('success');
          } catch (err) {
            console.error("Lỗi khi lưu đơn hàng sau thanh toán MoMo:", err);
            // Xảy ra nếu lỗi backend (đã trả tiền nhưng server sập/hết hàng)
            setStatus('failed'); 
          }
        } else {
          // Trường hợp F5 lại trang success
          setStatus('success');
        }
      } else {
        // 2. THANH TOÁN THẤT BẠI HOẶC BỊ HỦY -> KHÔNG LÀM GÌ, DB KHÔNG CÓ RÁC
        setStatus('failed');
        localStorage.removeItem('pendingMomoOrder');
      }
    };

    processReturn();
  }, [searchParams, clearCartLocal]);

  // Auto redirect về trang đơn hàng sau 5s nếu thành công
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => navigate('/orders'), 5000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center space-y-6 max-w-md w-full">
          <div className="flex justify-center">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Thanh toán thành công!</h1>
            <p className="text-muted-foreground">
              Cảm ơn bạn đã thanh toán qua MoMo. Đơn hàng của bạn đang được xử lý.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Bạn sẽ được chuyển về trang đơn hàng sau <strong>5 giây</strong>...
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Xem đơn hàng của tôi
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-accent transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md w-full">
        <div className="flex justify-center">
          <XCircle className="w-20 h-20 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Thanh toán thất bại</h1>
          <p className="text-muted-foreground">
            Đơn hàng chưa được thanh toán. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/checkout"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Thử lại
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-accent transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
