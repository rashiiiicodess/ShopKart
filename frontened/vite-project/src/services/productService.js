import API from './api';

export const fetchProducts = async (params = {}) => {
  const response = await API.get('/products', { params });
  return response.data;
};

export const fetchProductById = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};