import axios from 'axios';

const BASE_URL = '/api/designs';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const saveDesign = async (designData) => {
  const response = await axios.post(BASE_URL, designData, { headers: getAuthHeader() });
  return response.data;
};

export const getDesignsByUser = async (userId) => {
  const response = await axios.get(`${BASE_URL}/user/${userId}`, { headers: getAuthHeader() });
  return response.data;
};

export const getDesignById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
  return response.data;
};

export const getTemplates = async () => {
  const response = await axios.get(`${BASE_URL}/templates`, { headers: getAuthHeader() });
  return response.data;
};

export const deleteDesign = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
};

export const uploadThumbnail = async (file) => {
    const formData = new FormData();
    formData.append('files', file);
    const response = await axios.post('/api/upload', formData, {
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data[0];
};

