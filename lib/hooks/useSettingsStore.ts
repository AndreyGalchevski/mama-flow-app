import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import getStorage from '../storage';

interface SettingsState {
  remindersEnabled: boolean;
  nextReminderAt: number | null;
  reminderHoursDay: number;
  reminderHoursNight: number;
  toggleReminders: () => void;
  setNextReminder: (timestamp: number | null) => void;
  setReminderHoursDay: (hours: number) => void;
  setReminderHoursNight: (hours: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      remindersEnabled: true,
      nextReminderAt: null,
      reminderHoursDay: 2.5,
      reminderHoursNight: 4,
      toggleReminders: () => set({ remindersEnabled: !get().remindersEnabled }),
      setNextReminder: (timestamp) => set({ nextReminderAt: timestamp }),
      setReminderHoursDay: (hours) => set({ reminderHoursDay: hours }),
      setReminderHoursNight: (hours) => set({ reminderHoursNight: hours }),
    }),
    {
      name: 'settings',
      storage: getStorage<SettingsState>(),
    },
  ),
);
