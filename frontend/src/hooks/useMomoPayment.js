import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:8443';

/**
 * Custom hook để xử lý thanh toán qua MoMo.
 * 
 * Cách dùng trong Checkout.jsx hoặc bất kỳ component nào:
 * 
 * const { payWithMomo, isLoading } = useMomoPayment();
 * 
 * // Sau khi tạo đơn hàng thành công, gọi:
 * await payWithMomo({ orderId: createdOrder.id, amount: totalInVND });
 */
export function useMomoPayment() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Gọi API Backend để lấy link thanh toán MoMo, sau đó redirect người dùng.
   * 
   * @param {object} params
   * @param {number} params.orderId - ID đơn hàng trong DB của bạn
   * @param {number} params.amount  - Số tiền (VND, ví dụ: 50000)
   * @param {string} [params.orderInfo] - Ghi chú tuỳ chọn
   */
  const payWithMomo = async ({ orderId, amount, orderInfo }) => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${API_BASE_URL}/api/payment/momo/create`,
        { orderId, amount, orderInfo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;

      if (data.success && data.payUrl) {
        toast.success('Đang chuyển hướng đến MoMo...');
        // Redirect người dùng sang trang thanh toán của MoMo
        window.location.href = data.payUrl;
      } else {
        toast.error(data.message || 'Không thể tạo link thanh toán MoMo');
      }
    } catch (error) {
      console.error('MoMo payment error:', error);
      const errorMsg = error?.response?.data?.message || 'Lỗi kết nối, vui lòng thử lại';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return { payWithMomo, isLoading };
}
