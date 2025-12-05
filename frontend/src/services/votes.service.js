import api from './api';

/**
 * Service pour la gestion des votes et paiements
 */

// Initialize vote with payment
export const createVote = async (candidateId, paymentMethod, phone, email, voterName) => {
  try {
    const response = await api.post('/votes', {
      candidateId,
      paymentMethod,
      phone,
      email,
      voterName
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Create vote error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors du vote'
    };
  }
};

// Legacy: Initialize payment for vote (backwards compatibility)
export const initPayment = async (videoId, provider, amount, customerPhone) => {
  return createVote(videoId, provider, customerPhone);
};

// Get payment status
export const getPaymentStatus = async (reference) => {
  try {
    const response = await api.get(`/votes/${reference}/status`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Get payment status error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors de la vérification'
    };
  }
};

// Get my votes
export const getMyVotes = async () => {
  try {
    const response = await api.get('/votes/my-votes');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Get my votes error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors du chargement'
    };
  }
};

// Get candidate votes
export const getVideoVotes = async (videoId) => {
  try {
    const response = await api.get(`/votes/candidate/${videoId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Get video votes error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors du chargement'
    };
  }
};

// Export default as an object for destructuring
export const votesService = {
  createVote,
  initPayment,
  getPaymentStatus,
  getMyVotes,
  getVideoVotes
};

export default votesService;
