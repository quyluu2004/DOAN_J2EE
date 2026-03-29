import axios from 'axios';

const BASE_URL = '/api/colors';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllColors = async () => {
  const response = await axios.get(BASE_URL, { headers: getAuthHeader() });
  return response.data;
};

export const createColor = async (color) => {
  const response = await axios.post(BASE_URL, color, { headers: getAuthHeader() });
  return response.data;
};

export const updateColor = async (id, color) => {
  const response = await axios.put(`${BASE_URL}/${id}`, color, { headers: getAuthHeader() });
  return response.data;
};

export const deleteColor = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
};
