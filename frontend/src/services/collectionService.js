import axios from 'axios';

const BASE_URL = '/api/collections';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllCollections = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const createCollection = async (collection) => {
  const response = await axios.post(BASE_URL, collection, { headers: getAuthHeader() });
  return response.data;
};

export const updateCollection = async (id, collection) => {
  const response = await axios.put(`${BASE_URL}/${id}`, collection, { headers: getAuthHeader() });
  return response.data;
};

export const deleteCollection = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
};
