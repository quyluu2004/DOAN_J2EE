// walletService.js — API calls for Wallet feature

import { getToken } from "./authService";

const API_URL = "/api/wallet";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
});

// Lấy thông tin ví (balance, VIP status, transactions)
export const getWallet = async () => {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: authHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Lấy thông tin ví thất bại");
    return data;
};

// Nạp tiền qua MoMo
// Gửi MoMo IPN thủ công cho localhost (Dành cho môi trường dev khi MoMo không thể gọi callback)
export const syncMomoPaymentLocal = async (ipnData) => {
    const response = await fetch('/api/payment/momo/ipn', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(ipnData),
    });
    if (!response.ok) throw new Error("Sync IPN failed");
    return response.json();
};

export const topUpViaMomo = async (amount) => {
    const response = await fetch(`${API_URL}/topup`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ amount }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || data.message || "Nạp tiền thất bại");
    return data;
};

// Mua VIP
export const purchaseVip = async () => {
    const response = await fetch(`${API_URL}/purchase-vip`, {
        method: "POST",
        headers: authHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Mua VIP thất bại");
    return data;
};
