import API from './api';

export const fetchWishlist = async () => {
  const response = await API.get('/wishlist');
  return response.data;
};

export const addToWishlistApi = async (productId) => {
  const response = await API.post(`/wishlist/${productId}`);
  return response.data;
};

export const removeFromWishlistApi = async (productId) => {
  const response = await API.delete(`/wishlist/${productId}`);
  return response.data;
};

export const toggleWishlistApi = async (productId) => {
  const response = await axios.patch(`${API_URL}/${productId}/toggle`, {}, getAuthHeader());
  return response.data;
};