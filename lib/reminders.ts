import { addHours, isAfter } from 'date-fns';
import * as Notifications from 'expo-notifications';

import { useLogsStore } from './hooks/useLogsStore';
import { useSettingsStore } from './hooks/useSettingsStore';
import i18n from './i18n';
import { captureException } from './sentry';

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
    captureException(e instanceof Error ? e : new Error('Failed to set notification category'), {
      feature: 'reminders',
      action: 'setNotificationCategory',
    });
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

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Notification permissions not granted');
      captureException(new Error('Notification permissions not granted'), {
        permissionStatus: status,
        feature: 'reminders',
      });
      return;
    }

    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDENTIFIER);

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

    setNextReminder(nextReminderTime.getTime());

    await ensurePumpReminderCategory();

    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDENTIFIER,
      content: {
        title: i18n.t('reminders.title'),
        body: i18n.t('reminders.body', { hours: interval }),
        sound: true,
        categoryIdentifier: CATEGORY_IDENTIFIER,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: nextReminderTime,
      },
    });

    console.log(`Next pump reminder scheduled for: ${nextReminderTime.toISOString()}`);
  } catch (err) {
    console.error('Failed to schedule pump reminder:', err);
    captureException(err instanceof Error ? err : new Error('Unknown reminder scheduling error'), {
      feature: 'reminders',
      action: 'schedule',
    });
  }
}
