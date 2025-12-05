import api from './api';

// Login
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Register
export const register = async (name, email, phone, password) => {
  const response = await api.post('/auth/register', { name, email, phone, password });
  return response.data;
};

// Logout
export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// Refresh token
export const refresh = async (refreshToken) => {
  const response = await api.post('/auth/refresh', { refreshToken });
  return response.data;
};

// Get profile
export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

// Update profile
export const updateProfile = async (data) => {
  const response = await api.patch('/auth/profile', data);
  return response.data;
};

// Change password
export const changePassword = async (oldPassword, newPassword) => {
  const response = await api.post('/auth/change-password', { oldPassword, newPassword });
  return response.data;
};

// Delete account
export const deleteAccount = async () => {
  const response = await api.delete('/auth/account');
  return response.data;
};

// Request password reset
export const requestPasswordReset = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

// Verify reset code
export const verifyResetCode = async (email, code) => {
  const response = await api.post('/auth/verify-reset-code', { email, code });
  return response.data;
};

// Reset password
export const resetPassword = async (email, code, newPassword) => {
  const response = await api.post('/auth/reset-password', { email, code, newPassword });
  return response.data;
};

// Export default as an object for destructuring
export const authService = {
  login,
  register,
  logout,
  refresh,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  requestPasswordReset,
  verifyResetCode,
  resetPassword
};

export default authService;
