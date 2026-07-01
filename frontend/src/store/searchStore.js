import { create } from 'zustand';
import * as gameService from '../services/gameService.js';

const initialSearchState = {
  query: '',
  results: [],
  meta: { page: 1, limit: 20, hasNextPage: false },
  loading: false,
  error: null,
};

export const useSearchStore = create((set) => ({
  ...initialSearchState,

  search: async (query, page = 1, limit = 20, ordering = '-rating') => {
    set({ loading: true, error: null, query });
    try {
      const response = await gameService.searchGames(query, page, limit, ordering);
      if (response.success) {
        set({
          results: response.data || [],
          meta: response.meta || { page, limit, hasNextPage: false },
          loading: false,
        });
      } else {
        throw new Error(response.message || 'Failed to search games.');
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Unable to search the GAMEZ database.';
      set({
        loading: false,
        error: message,
        results: [],
      });
    }
  },

  clearSearch: () => set(initialSearchState),
  reset: () => set(initialSearchState),
}));
