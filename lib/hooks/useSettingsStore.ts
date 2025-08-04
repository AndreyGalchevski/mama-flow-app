import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import getStorage from '../storage';

interface SettingsState {
  remindersEnabled: boolean;
  nextReminderAt: number | null;
  toggleReminders: () => void;
  setNextReminder: (timestamp: number | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      remindersEnabled: true,
      nextReminderAt: null,
      toggleReminders: () => set({ remindersEnabled: !get().remindersEnabled }),
      setNextReminder: (timestamp) => set({ nextReminderAt: timestamp }),
    }),
    {
      name: 'settings',
      storage: getStorage<SettingsState>(),
    },
  ),
);
