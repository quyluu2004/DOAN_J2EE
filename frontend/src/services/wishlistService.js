import axios from 'axios';

const BASE_URL = '/api/products/wishlist';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getWishlist = async () => {
    const response = await axios.get(BASE_URL, { headers: getAuthHeader() });
    return response.data;
};

export const toggleWishlist = async (productId) => {
    const response = await axios.post(`${BASE_URL}/${productId}`, {}, { headers: getAuthHeader() });
    return response.data;
};

export const checkWishlistStatus = async (productId) => {
    const response = await axios.get(`${BASE_URL}/check/${productId}`, { headers: getAuthHeader() });
    return response.data;
};
