import { create } from 'zustand';
import api from '../services/api.js';

export const useRecommendationStore = create((set) => ({
  recommendations: null,
  loading: false,
  error: null,

  fetchRecommendations: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/dashboard/recommendations');
      if (res.data.success) {
        set({ recommendations: res.data.data, loading: false });
      } else {
        throw new Error(res.data.message || 'Failed to fetch recommendations.');
      }
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || err.message || 'Failed to fetch recommendations.',
      });
    }
  }
}));
