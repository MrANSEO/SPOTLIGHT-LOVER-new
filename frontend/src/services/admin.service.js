import api from './api';

/**
 * Service API pour l'administration
 */
class AdminService {
  // ========== DASHBOARD ==========
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  }

  // ========== USERS ==========
  async getAllUsers(page = 1, limit = 20, search = '', role = '') {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (search) params.append('search', search);
    if (role) params.append('role', role);
    
    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  }

  async getUserById(userId) {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  }

  async updateUser(userId, data) {
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data;
  }

  async deleteUser(userId) {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  }

  async banUser(userId, reason) {
    const response = await api.post(`/admin/users/${userId}/ban`, { reason });
    return response.data;
  }

  async unbanUser(userId) {
    const response = await api.post(`/admin/users/${userId}/unban`);
    return response.data;
  }

  // ========== CANDIDATES/VIDEOS ==========
  async getAllCandidates(page = 1, limit = 20, status = '', category = '') {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    
    const response = await api.get(`/admin/candidates?${params.toString()}`);
    return response.data;
  }

  async approveCandidate(candidateId) {
    const response = await api.patch(`/admin/candidates/${candidateId}/status`, { 
      status: 'APPROVED' 
    });
    return response.data;
  }

  async rejectCandidate(candidateId, reason) {
    const response = await api.patch(`/admin/candidates/${candidateId}/status`, { 
      status: 'REJECTED',
      rejectionReason: reason
    });
    return response.data;
  }

  async deleteCandidate(candidateId) {
    const response = await api.delete(`/admin/candidates/${candidateId}`);
    return response.data;
  }

  // ========== VOTES ==========
  async getAllVotes(page = 1, limit = 20, status = '') {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (status) params.append('status', status);
    
    const response = await api.get(`/admin/votes?${params.toString()}`);
    return response.data;
  }

  async getVoteById(voteId) {
    const response = await api.get(`/admin/votes/${voteId}`);
    return response.data;
  }

  async refundVote(voteId, reason) {
    const response = await api.post(`/admin/votes/${voteId}/refund`, { reason });
    return response.data;
  }

  // ========== STATISTICS ==========
  async getAnalytics(startDate, endDate, groupBy = 'day') {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    params.append('groupBy', groupBy);
    
    const response = await api.get(`/admin/analytics?${params.toString()}`);
    return response.data;
  }

  async getRevenueStats(period = 'month') {
    const response = await api.get(`/admin/analytics/revenue?period=${period}`);
    return response.data;
  }

  // ========== SETTINGS ==========
  async getSystemSettings() {
    const response = await api.get('/admin/settings');
    return response.data;
  }

  async updateSystemSettings(settings) {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  }

  // ========== LOGS ==========
  async getActivityLogs(page = 1, limit = 50, action = '', userId = '') {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (action) params.append('action', action);
    if (userId) params.append('userId', userId);
    
    const response = await api.get(`/admin/logs?${params.toString()}`);
    return response.data;
  }

  // ========== EXPORT ==========
  async exportUsers(format = 'csv') {
    const response = await api.get(`/admin/export/users?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async exportVotes(format = 'csv', startDate = '', endDate = '') {
    const params = new URLSearchParams();
    params.append('format', format);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/admin/export/votes?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export default new AdminService();
