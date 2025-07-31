import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import getStorage from '../storage';

interface SettingsState {
  remindersEnabled: boolean;
  toggleReminders: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      remindersEnabled: true,
      toggleReminders: () => set({ remindersEnabled: !get().remindersEnabled }),
    }),
    {
      name: 'settings',
      storage: getStorage<SettingsState>(),
    },
  ),
);
