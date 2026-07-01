import { create } from 'zustand';
import * as preferenceService from '../services/preferenceService.js';
import { useUiStore } from './uiStore.js';

const initialPreferenceState = {
  preferences: {
    theme: 'DARK',
    defaultView: 'CARD',
  },
  loading: false,
  error: null,
};

export const usePreferenceStore = create((set, get) => ({
  ...initialPreferenceState,

  fetchPreferences: async () => {
    set({ loading: true, error: null });
    try {
      const response = await preferenceService.getPreferences();
      if (response.success && response.data) {
        set({
          preferences: {
            theme: response.data.theme || 'DARK',
            defaultView: response.data.defaultView || 'CARD',
          },
          loading: false,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch preferences');
      }
    } catch (error) {
      set({ loading: false, error: error.message });
      useUiStore.getState().addToast('Failed to load user preferences.', 'error');
    }
  },

  updatePreference: async (updates) => {
    const previousPreferences = get().preferences;
    
    // 1. Optimistic Update in Zustand
    set((state) => ({
      preferences: { ...state.preferences, ...updates },
    }));

    try {
      const response = await preferenceService.updatePreferences(updates);
      if (!response.success) {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      // 2. Rollback on Failure
      set({ preferences: previousPreferences });
      useUiStore.getState().addToast(`Failed to update settings: ${error.message}`, 'error');
    }
  },

  reset: () => set(initialPreferenceState),
}));

// Exposed Selectors for UI Components
export const useTheme = () => usePreferenceStore((state) => state.preferences.theme);
export const useDefaultView = () => usePreferenceStore((state) => state.preferences.defaultView);
export const useIsDark = () => usePreferenceStore((state) => state.preferences.theme === 'DARK');
export const usePreferencesLoading = () => usePreferenceStore((state) => state.loading);
