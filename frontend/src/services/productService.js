import axios from 'axios';

const BASE_URL = '/api';

export const getProducts = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null && v !== '')
  );
  const response = await axios.get(`${BASE_URL}/products/search`, { params: cleanParams });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(`${BASE_URL}/products/${id}`);
  return response.data;
};

export const getAllProducts = async (params = {}) => {
    const response = await axios.get(`${BASE_URL}/products`, { params });
    return response.data;
};
