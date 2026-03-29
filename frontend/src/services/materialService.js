import axios from 'axios';

const BASE_URL = '/api/materials';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllMaterials = async () => {
  const response = await axios.get(BASE_URL, { headers: getAuthHeader() });
  return response.data;
};

export const createMaterial = async (material) => {
  const response = await axios.post(BASE_URL, material, { headers: getAuthHeader() });
  return response.data;
};

export const updateMaterial = async (id, material) => {
  const response = await axios.put(`${BASE_URL}/${id}`, material, { headers: getAuthHeader() });
  return response.data;
};

export const deleteMaterial = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
};
