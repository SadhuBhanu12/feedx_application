import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './storage';
import { supabase } from '@/lib/supabase';

export type AuthStatus = 'INITIALIZING' | 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'SESSION_EXPIRED';

interface AuthState {
  user: any | null;
  setUser: (user: any | null) => void;
  authStatus: AuthStatus;
  setAuthStatus: (status: AuthStatus) => void;
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
      setUser: (user) => set((state) => {
        const nextUser = typeof user === 'function' ? user(state.user) : user;
        return {
          user: nextUser,
          authStatus: nextUser ? 'AUTHENTICATED' : 'UNAUTHENTICATED',
        };
      }),
      authStatus: 'INITIALIZING',
      setAuthStatus: (status) => set({ authStatus: status }),
      isBooting: true,
      setBooting: (status) => set({ isBooting: status }),
      globalSettings: {},
      setGlobalSettings: (settings) => set({ globalSettings: settings }),
      clearAuth: () => {
        set({ user: null, authStatus: 'UNAUTHENTICATED' });
      },
    }),
    {
      name: 'auth-store-v3',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ user: state.user, globalSettings: state.globalSettings }),
    }
  )
);
