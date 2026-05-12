import axios from 'axios';
import { API_BASE_URL } from '../config';

const BASE_URL = `${API_BASE_URL}/api/stats`;

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getDashboardStats = async () => {
    const response = await axios.get(`${BASE_URL}/dashboard`, { headers: getAuthHeader() });
    return response.data;
};
