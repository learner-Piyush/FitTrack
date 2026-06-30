import api from '../lib/api';

export const progressService = {
  getAll: async () => {
    const response = await api.get('/progress');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/progress', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/progress/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/progress/${id}`);
    return response.data;
  },
};
