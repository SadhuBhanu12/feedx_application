import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './storage';

export type NetworkQuality = 'Excellent' | 'Good' | 'Slow' | 'Very Slow' | 'Offline';

interface UIState {
  isOffline: boolean;
  networkQuality: NetworkQuality;
  setNetworkStatus: (isOffline: boolean, quality: NetworkQuality) => void;
  isGlobalLoading: boolean;
  setGlobalLoading: (status: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isOffline: false,
      networkQuality: 'Excellent',
      setNetworkStatus: (isOffline, quality) => set({ isOffline, networkQuality: quality }),
      isGlobalLoading: false,
      setGlobalLoading: (status) => set({ isGlobalLoading: status }),
    }),
    {
      name: 'ui-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ 
        isOffline: state.isOffline, 
        networkQuality: state.networkQuality 
      }),
    }
  )
);
