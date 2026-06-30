import api from '../lib/api';

export const workoutService = {
  getAll: async () => {
    const response = await api.get('/workout');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/workout/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/workout', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/workout/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/workout/${id}`);
    return response.data;
  },
};
