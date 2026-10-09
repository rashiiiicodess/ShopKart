import API from './api';

export const getCartApi = async () => {
  const res = await API.get('/cart');
  return res.data;
};

export const addToCartApi = async (productId) => {
  const res = await API.post(`/cart/${productId}`);
  return res.data;
};

export const updateCartQtyApi = async (productId, quantity) => {
  const res = await API.patch(`/cart/${productId}`, { quantity });
  return res.data;
};

export const removeFromCartApi = async (productId) => {
  const res = await API.delete(`/cart/${productId}`);
  return res.data;
};