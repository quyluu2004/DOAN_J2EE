import axios from 'axios';
import { logout } from './authService';
import { API_BASE_URL } from '../config';

// Set base URL cho tất cả axios requests (production: trỏ về backend domain)
axios.defaults.baseURL = API_BASE_URL;

// Add a request interceptor to attach the JWT token to every request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized globally
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      // Avoid infinite loops if refresh or login fails
      if (originalRequest.url === '/api/auth/refresh' || originalRequest.url === '/api/auth/login') {
        logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Assume backend uses HttpOnly cookie for Refresh Token
        const response = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        
        const newToken = response.data.token;
        if (newToken) {
          // Update the localized token storage
          localStorage.setItem('token', newToken);
          
          // Retry the original request with new token
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error('Session expired. Logging out.');
        logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
