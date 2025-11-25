import api from './api';

// Get leaderboard
export const getLeaderboard = async (params = {}) => {
  const response = await api.get('/leaderboard', { params });
  return response.data;
};

// Get participant stats
export const getParticipantStats = async (participantId) => {
  const response = await api.get(`/leaderboard/participant/${participantId}`);
  return response.data;
};

// Get top participants
export const getTopParticipants = async (limit = 10) => {
  const response = await api.get('/leaderboard/top', { params: { limit } });
  return response.data;
};
