import { addHours, isAfter } from 'date-fns';
import * as Notifications from 'expo-notifications';

import { useLogsStore } from './hooks/useLogsStore';
import { useSettingsStore } from './hooks/useSettingsStore';
import { captureException } from './sentry';

const NOTIFICATION_IDENTIFIER = 'pump-reminder';

function isNightTime(date: Date): boolean {
  const hour = date.getHours();
  return hour >= 0 && hour < 6;
}

export async function scheduleNextPumpReminder() {
  try {
    const { remindersEnabled, setNextReminder, reminderHoursDay, reminderHoursNight } =
      useSettingsStore.getState();

    if (!remindersEnabled) {
      setNextReminder(null);
      return;
    }

    // Request notification permissions first
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

    // Only schedule if the reminder time is in the future
    if (!isAfter(nextReminderTime, now)) {
      console.log('Next reminder time is in the past, not scheduling');
      return;
    }

    setNextReminder(nextReminderTime.getTime());

    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDENTIFIER,
      content: {
        title: '⏱ Time to pump?',
        body: `It's been ${interval} hours since your last pump log.`,
        sound: true,
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
