import { addHours, addMinutes, isAfter, isBefore } from 'date-fns';
import * as Notifications from 'expo-notifications';

import { useLogsStore } from './hooks/useLogsStore';
import { useSettingsStore } from './hooks/useSettingsStore';
import i18n from './i18n';

export const NOTIFICATION_IDENTIFIER = 'pump-reminder';
export const CATEGORY_IDENTIFIER = 'pump-reminder-category';
export const ACTION_START_PUMP = 'START_PUMP';

export async function ensurePumpReminderCategory() {
  try {
    await Notifications.setNotificationCategoryAsync(CATEGORY_IDENTIFIER, [
      {
        identifier: ACTION_START_PUMP,
        buttonTitle: i18n.t('reminders.startPumpAction'),
        options: {
          opensAppToForeground: true,
        },
      },
    ]);
  } catch (e) {
    console.error('Failed to set notification category:', e);
  }
}

function isNightTime(date: Date): boolean {
  const { nightStartMinutes, nightEndMinutes } = useSettingsStore.getState();

  const minutes = date.getHours() * 60 + date.getMinutes();
  // Support intervals that may wrap past midnight (e.g., 22:00 -> 06:00)
  if (nightStartMinutes <= nightEndMinutes) {
    return minutes >= nightStartMinutes && minutes < nightEndMinutes;
  }
  // Wrapping case
  return minutes >= nightStartMinutes || minutes < nightEndMinutes;
}

export async function scheduleNextPumpReminder() {
  try {
    const { remindersEnabled, setNextReminder, reminderHoursDay, reminderHoursNight } =
      useSettingsStore.getState();

    if (!remindersEnabled) {
      setNextReminder(null);
      return;
    }

    const { logs } = useLogsStore.getState();

    const lastLog = logs[logs.length - 1];

    if (!lastLog) {
      console.log('No logs found, not scheduling reminder');
      return;
    }

    const lastTime = new Date(lastLog.timestamp);
    const now = new Date();

    const interval = isNightTime(now) ? reminderHoursNight : reminderHoursDay;
    const nextReminderTime = addHours(lastTime, interval);

    if (!isAfter(nextReminderTime, now)) {
      console.log('Next reminder time is in the past, not scheduling');
      return;
    }

    const ok = await scheduleReminderAt(nextReminderTime, interval, {
      onPermissionDenied: (status) => {
        console.log('Notification permissions not granted');
      },
    });

    if (ok) {
      setNextReminder(nextReminderTime.getTime());
    }

    console.log(`Next pump reminder scheduled for: ${nextReminderTime.toISOString()}`);
  } catch (err) {
    console.error('Failed to schedule pump reminder:', err);
  }
}

const getHoursSinceLastLog = (newTime: Date) => {
  try {
    const { logs } = useLogsStore.getState();
    const lastLog = logs[logs.length - 1];
    if (!lastLog) {
      return 0;
    }
    const diffMs = newTime.getTime() - lastLog.timestamp;
    const hoursApprox = Math.max(1, Math.round(diffMs / (60 * 60 * 1000)));
    return hoursApprox;
  } catch {
    return 0;
  }
};

export async function snoozeNextPumpReminder(minutes = 10) {
  try {
    const { remindersEnabled, nextReminderAt, setNextReminder } = useSettingsStore.getState();

    if (!remindersEnabled || !nextReminderAt) {
      return;
    }

    const base = new Date(nextReminderAt);
    const now = new Date();
    const effectiveBase = isBefore(base, now) ? now : base;
    const newTime = addMinutes(effectiveBase, minutes);

    // Update state immediately even if permissions are denied, preserving prior behavior
    setNextReminder(newTime.getTime());

    await scheduleReminderAt(newTime, getHoursSinceLastLog(newTime), {
      onPermissionDenied: () => {
        console.log('Notification permissions not granted; stored snoozed time only');
      },
    });

    console.log(`Next pump reminder snoozed to: ${newTime.toISOString()}`);
  } catch (err) {
    console.error('Failed to snooze pump reminder:', err);
  }
}

/**
 * Shared scheduler: handles permission, cancellation, category, and scheduling.
 * Returns true when permissions are granted and scheduling attempted; false otherwise.
 */
async function scheduleReminderAt(
  date: Date,
  hoursForBody: number,
  { onPermissionDenied }: { onPermissionDenied?: (status: Notifications.PermissionStatus) => void },
): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    onPermissionDenied?.(status);
    return false;
  }

  await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDENTIFIER);

  await ensurePumpReminderCategory();

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDENTIFIER,
    content: {
      title: i18n.t('reminders.title'),
      body: i18n.t('reminders.body', { hours: hoursForBody }),
      sound: true,
      categoryIdentifier: CATEGORY_IDENTIFIER,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
    },
  });

  return true;
}
