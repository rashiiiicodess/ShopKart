import API from './api';

export const createPaymentOrderApi = async (shippingAddress) => {
  const res = await API.post('/orders/create-payment-order', { shippingAddress });
  return res.data;
};

export const verifyPaymentApi = async (paymentData) => {
  const res = await API.post('/orders/verify-payment', paymentData);
  return res.data;
};

export const getMyOrdersApi = async () => {
  const res = await API.get('/orders');
  return res.data;
};

export const getOrderByIdApi = async (id) => {
  const res = await API.get(`/orders/${id}`);
  return res.data;
};