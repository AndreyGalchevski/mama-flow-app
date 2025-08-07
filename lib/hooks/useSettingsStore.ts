import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import getStorage from '../storage';

interface SettingsState {
  remindersEnabled: boolean;
  nextReminderAt: number | null;
  reminderHoursDay: number;
  reminderHoursNight: number;
  appLaunchCount: number;
  lastRatingPromptDate: number | null;
  hasUserRated: boolean;
  toggleReminders: () => void;
  setNextReminder: (timestamp: number | null) => void;
  updateReminderIntervals: (dayHours: number, nightHours: number) => void;
  incrementAppLaunchCount: () => void;
  markRatingPromptShown: () => void;
  markUserRated: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      remindersEnabled: true,
      nextReminderAt: null,
      reminderHoursDay: 2.5,
      reminderHoursNight: 4,
      appLaunchCount: 0,
      lastRatingPromptDate: null,
      hasUserRated: false,
      toggleReminders: () => set({ remindersEnabled: !get().remindersEnabled }),
      setNextReminder: (timestamp) => set({ nextReminderAt: timestamp }),
      updateReminderIntervals: (dayHours, nightHours) => {
        set({
          reminderHoursDay: dayHours,
          reminderHoursNight: nightHours,
        });
      },
      incrementAppLaunchCount: () => set({ appLaunchCount: get().appLaunchCount + 1 }),
      markRatingPromptShown: () => set({ lastRatingPromptDate: Date.now() }),
      markUserRated: () => set({ hasUserRated: true }),
    }),
    {
      name: 'settings',
      storage: getStorage<SettingsState>(),
    },
  ),
);
