import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authService from '../services/authService.js';
import { useLibraryStore } from './libraryStore.js';
import { useSearchStore } from './searchStore.js';
import { useUiStore } from './uiStore.js';
import { usePreferenceStore } from './preferenceStore.js';

const initialAuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialAuthState,
      token: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.login(email, password);
          if (response.success && response.data?.token) {
            set({ token: response.data.token, loading: false });
            await get().fetchCurrentUser();
            return { success: true };
          } else {
            throw new Error(response.message || 'Login failed.');
          }
        } catch (error) {
          set({ loading: false, error: error.message || 'Error logging in.' });
          return { success: false, error: error.message };
        }
      },

      register: async (username, email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.register(username, email, password);
          if (response.success) {
            set({ loading: false });
            return { success: true };
          } else {
            throw new Error(response.message || 'Registration failed.');
          }
        } catch (error) {
          set({ loading: false, error: error.message || 'Error registering account.' });
          return { success: false, error: error.message };
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await authService.logout().catch(() => {});
        } finally {
          useLibraryStore.getState().reset();
          useSearchStore.getState().reset();
          useUiStore.getState().reset();
          usePreferenceStore.getState().reset();
          
          set({
            ...initialAuthState,
            token: null,
          });
        }
      },

      fetchCurrentUser: async () => {
        const token = get().token;
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ loading: true, error: null });
        try {
          const response = await authService.getMe();
          if (response.success && response.data?.user) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              loading: false,
            });
            await usePreferenceStore.getState().fetchPreferences();
          } else {
            throw new Error(response.message || 'Failed to validate session.');
          }
        } catch {
          set({
            ...initialAuthState,
            token: null,
            loading: false,
          });
          useLibraryStore.getState().reset();
          useSearchStore.getState().reset();
          useUiStore.getState().reset();
          usePreferenceStore.getState().reset();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
