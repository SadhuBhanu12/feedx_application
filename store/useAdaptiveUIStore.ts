import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './storage';

export type UserStage = 'NEW_USER' | 'ACTIVE_SCHOLAR' | 'UPCOMING_EVENT' | 'APPLICATION_PENDING';
export type ProgressStage = 'STAGE_25' | 'STAGE_65' | 'STAGE_90';

interface AdaptiveUIState {
  userStage: UserStage;
  progressStage: ProgressStage;
  actionFrequencies: Record<string, number>;
  expandedCards: Record<string, boolean>;
  
  setUserStage: (stage: UserStage) => void;
  setProgressStage: (stage: ProgressStage) => void;
  incrementActionFrequency: (actionKey: string) => void;
  toggleCardExpanded: (cardId: string) => void;
  isCardExpanded: (cardId: string) => boolean;
  clearExpandedCards: () => void;
}

export const useAdaptiveUIStore = create<AdaptiveUIState>()(
  persist(
    (set, get) => ({
      userStage: 'NEW_USER',
      progressStage: 'STAGE_25',
      actionFrequencies: {},
      expandedCards: {},

      setUserStage: (userStage) => set({ userStage }),

      setProgressStage: (progressStage) => set({ progressStage }),

      incrementActionFrequency: (actionKey) =>
        set((state) => ({
          actionFrequencies: {
            ...state.actionFrequencies,
            [actionKey]: (state.actionFrequencies[actionKey] || 0) + 1,
          },
        })),

      toggleCardExpanded: (cardId) =>
        set((state) => ({
          expandedCards: {
            ...state.expandedCards,
            [cardId]: !state.expandedCards[cardId],
          },
        })),

      isCardExpanded: (cardId) => !!get().expandedCards[cardId],

      clearExpandedCards: () => set({ expandedCards: {} }),
    }),
    {
      name: 'adaptive-ui-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        userStage: state.userStage,
        progressStage: state.progressStage,
        actionFrequencies: state.actionFrequencies,
      }),
    }
  )
);

export default useAdaptiveUIStore;
