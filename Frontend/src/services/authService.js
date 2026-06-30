import api from '../lib/api';

export const authService = {
  register: async (formData) => {
    const response = await api.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/current-user');
    return response.data;
  },

  updateAccount: async (data) => {
    const response = await api.patch('/auth/update-account', data);
    return response.data;
  },

  updateAvatar: async (formData) => {
    const response = await api.patch('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post(`/auth/reset-password/${token}`, {
      newPassword,
    });
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  resendVerification: async () => {
    const response = await api.post('/auth/resend-email-verification');
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/auth/delete-account');
    return response.data;
  },
};
