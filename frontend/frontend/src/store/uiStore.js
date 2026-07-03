import { create } from 'zustand';

const initialUiState = {
  sidebarState: 'open',
  activeModal: null,
  loadingOverlay: false,
  toasts: [],
};

export const useUiStore = create((set, get) => ({
  ...initialUiState,

  toggleSidebar: () => set((state) => ({ sidebarState: state.sidebarState === 'open' ? 'closed' : 'open' })),
  showModal: (activeModal) => set({ activeModal }),
  hideModal: () => set({ activeModal: null }),
  setLoadingOverlay: (loadingOverlay) => set({ loadingOverlay }),
  
  addToast: (message, type = 'info') => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));
    
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),

  reset: () => set(initialUiState),
}));
