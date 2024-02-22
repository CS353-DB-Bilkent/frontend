import { create } from 'zustand';

export const useLoadingStore = create((set) => ({
  isLoading: false,
  setLoading: async (isLoading) => {
    set((state) => ({ ...state, isLoading }));
  },
}));
