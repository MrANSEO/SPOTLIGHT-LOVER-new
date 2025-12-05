import api from './api';

/**
 * Service pour la gestion du classement
 */

// Get leaderboard
export const getLeaderboard = async (params = {}) => {
  try {
    const response = await api.get('/leaderboard', { params });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors du chargement du classement'
    };
  }
};

// Get participant stats
export const getParticipantStats = async (participantId) => {
  try {
    const response = await api.get(`/leaderboard/participant/${participantId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Get participant stats error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors du chargement des stats'
    };
  }
};

// Get top participants
export const getTopParticipants = async (limit = 10) => {
  try {
    const response = await api.get('/leaderboard/top', { params: { limit } });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Get top participants error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors du chargement du top'
    };
  }
};

// Export default as an object for destructuring
export const leaderboardService = {
  getLeaderboard,
  getParticipantStats,
  getTopParticipants
};

export default leaderboardService;
