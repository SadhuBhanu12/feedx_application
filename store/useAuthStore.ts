import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './storage';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: any | null;
  setUser: (user: any | null) => void;
  isBooting: boolean;
  setBooting: (status: boolean) => void;
  globalSettings: Record<string, any>;
  setGlobalSettings: (settings: Record<string, any>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set((state) => ({ user: typeof user === 'function' ? user(state.user) : user })),
      isBooting: false,
      setBooting: (status) => set({ isBooting: status }),
      globalSettings: {},
      setGlobalSettings: (settings) => set({ globalSettings: settings }),
      clearAuth: () => {
        set({ user: null });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ user: state.user, globalSettings: state.globalSettings }),
    }
  )
);
