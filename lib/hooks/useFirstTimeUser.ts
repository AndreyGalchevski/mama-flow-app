import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import getStorage from '../storage';

interface FirstTimeUserState {
  hasSeenWelcome: boolean;
  markWelcomeSeen: () => void;
  resetFirstTime: () => void;
}

export const useFirstTimeUser = create<FirstTimeUserState>()(
  persist(
    (set) => ({
      hasSeenWelcome: false,
      markWelcomeSeen: () => {
        set({ hasSeenWelcome: true });
      },
      resetFirstTime: () => {
        set({ hasSeenWelcome: false });
      },
    }),
    {
      name: 'first-time-user',
      storage: getStorage<FirstTimeUserState>(),
    },
  ),
);

export const useIsFirstTime = () => useFirstTimeUser((state) => !state.hasSeenWelcome);
export const useShowWelcome = () => useFirstTimeUser((state) => !state.hasSeenWelcome);
export const useMarkWelcomeSeen = () => useFirstTimeUser((state) => state.markWelcomeSeen);
export const useResetFirstTime = () => useFirstTimeUser((state) => state.resetFirstTime);
