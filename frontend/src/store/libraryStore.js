import { create } from 'zustand';
import * as libraryService from '../services/libraryService.js';

const initialLibraryState = {
  entries: [],
  selectedEntry: null,
  filters: {},
  sortOrder: 'alphabetical',
  viewMode: 'card',
  loading: false,
  error: null,
};

export const useLibraryStore = create((set, get) => ({
  ...initialLibraryState,

  fetchLibrary: async () => {
    set({ loading: true, error: null });
    try {
      const response = await libraryService.getLibrary();
      if (response.success) {
        set({ entries: response.data || [], loading: false });
      } else {
        throw new Error(response.message || 'Failed to fetch library.');
      }
    } catch (error) {
      set({ loading: false, error: error.message || 'Error fetching library.' });
    }
  },

  fetchSingleEntry: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await libraryService.getEntryDetails(id);
      if (response.success) {
        set({ selectedEntry: response.data || null, loading: false });
      } else {
        throw new Error(response.message || 'Failed to fetch library details.');
      }
    } catch (error) {
      set({ loading: false, error: error.message || 'Error fetching single entry details.' });
    }
  },

  addGame: async (rawgId, status) => {
    set({ loading: true, error: null });
    try {
      const response = await libraryService.addGame(rawgId, status);
      if (response.success) {
        const newEntry = response.data;
        set((state) => ({
          entries: [newEntry, ...state.entries],
          loading: false,
        }));
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to add game to library.');
      }
    } catch (error) {
      set({ loading: false, error: error.message || 'Error adding game.' });
      return { success: false, error: error.message };
    }
  },

  updateEntry: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await libraryService.updateEntry(id, updates);
      if (response.success) {
        const updatedEntry = response.data;
        set((state) => ({
          entries: state.entries.map((e) => (e.id === id ? { ...e, ...updatedEntry } : e)),
          selectedEntry: state.selectedEntry?.id === id ? { ...state.selectedEntry, ...updatedEntry } : state.selectedEntry,
          loading: false,
        }));
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to update library entry.');
      }
    } catch (error) {
      set({ loading: false, error: error.message || 'Error updating entry.' });
      return { success: false, error: error.message };
    }
  },

  deleteGame: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await libraryService.deleteEntry(id);
      if (response.success) {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
          selectedEntry: state.selectedEntry?.id === id ? null : state.selectedEntry,
          loading: false,
        }));
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to delete library entry.');
      }
    } catch (error) {
      set({ loading: false, error: error.message || 'Error deleting game.' });
      return { success: false, error: error.message };
    }
  },

  refreshLibrary: async () => {
    await get().fetchLibrary();
  },

  setViewMode: (viewMode) => set({ viewMode }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setFilters: (filters) => set({ filters }),

  reset: () => set(initialLibraryState),
}));
