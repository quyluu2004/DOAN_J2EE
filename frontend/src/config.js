// config.js — Cấu hình chung cho frontend
// Khi deploy: set VITE_API_URL=https://your-backend.onrender.com trên Vercel
// Khi dev local: để trống (Vite proxy sẽ xử lý)
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';
