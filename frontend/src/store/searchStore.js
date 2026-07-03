import { create } from 'zustand';
import * as gameService from '../services/gameService.js';
import axios from 'axios';

const initialSearchState = {
  query: '',
  results: [],
  meta: { page: 1, limit: 20, hasNextPage: false },
  loading: false,
  error: null,
  ordering: 'relevance',
  filters: {},
};

let currentAbortController = null;

export const useSearchStore = create((set, get) => ({
  ...initialSearchState,

  search: async (query, page = 1, limit = 20, ordering = 'relevance', filters = {}) => {
    // Cancel any stale/ongoing request
    if (currentAbortController) {
      currentAbortController.abort();
    }
    currentAbortController = new AbortController();
    const { signal } = currentAbortController;

    set({
      loading: true,
      error: null,
      query,
      ordering,
      filters
    });

    try {
      const response = await gameService.searchGames(query, page, limit, ordering, filters, { signal });
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
      if (axios.isCancel(error) || error.name === 'CanceledError' || error.name === 'AbortError') {
        // Stale request cancelled; ignore this error
        return;
      }
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

  setFilters: (newFilters) => set({ filters: { ...get().filters, ...newFilters } }),
  setOrdering: (newOrdering) => set({ ordering: newOrdering }),
  clearSearch: () => set(initialSearchState),
  reset: () => set(initialSearchState),
}));
