import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import getStorage from '../storage';

interface SettingsState {
  remindersEnabled: boolean;
  nextReminderAt: number | null;
  reminderHoursDay: number;
  reminderHoursNight: number;
  // Night time interval in minutes since midnight
  nightStartMinutes: number;
  nightEndMinutes: number;
  appLaunchCount: number;
  lastRatingPromptDate: number | null;
  hasUserRated: boolean;
  toggleReminders: () => void;
  setNextReminder: (timestamp: number | null) => void;
  updateReminderIntervals: (dayHours: number, nightHours: number) => void;
  updateNightTimeInterval: (startMinutes: number, endMinutes: number) => void;
  incrementAppLaunchCount: () => void;
  markRatingPromptShown: () => void;
  markUserRated: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      remindersEnabled: true,
      nextReminderAt: null,
      reminderHoursDay: 3,
      reminderHoursNight: 3,
      nightStartMinutes: 0, // 00:00
      nightEndMinutes: 6 * 60, // 06:00
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
      updateNightTimeInterval: (startMinutes, endMinutes) => {
        set({
          nightStartMinutes: startMinutes,
          nightEndMinutes: endMinutes,
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
