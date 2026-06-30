import api from '../lib/api';

export const dietService = {
  getAll: async () => {
    const response = await api.get('/diet');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/diet/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/diet', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/diet/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/diet/${id}`);
    return response.data;
  },
};
