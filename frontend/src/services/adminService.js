import axios from 'axios';

const BASE_URL = '/api/admin/stats';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getDashboardStats = async () => {
    const response = await axios.get(`${BASE_URL}/dashboard`, { headers: getAuthHeader() });
    return response.data;
};
