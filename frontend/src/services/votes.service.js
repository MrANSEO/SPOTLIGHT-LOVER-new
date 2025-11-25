import api from './api';

// Initialize payment for vote
export const initPayment = async (videoId, provider, amount, customerPhone) => {
  const response = await api.post('/votes/init-payment', {
    videoId,
    provider,
    amount,
    customerPhone,
  });
  return response.data;
};

// Get payment status
export const getPaymentStatus = async (reference) => {
  const response = await api.get(`/votes/payment-status/${reference}`);
  return response.data;
};

// Get my votes
export const getMyVotes = async () => {
  const response = await api.get('/votes/my-votes');
  return response.data;
};

// Get video votes
export const getVideoVotes = async (videoId) => {
  const response = await api.get(`/votes/video/${videoId}`);
  return response.data;
};
