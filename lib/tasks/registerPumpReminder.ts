import { differenceInHours } from 'date-fns';
import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

import { useLogsStore } from '../hooks/useLogsStore';

const TASK_NAME = 'BACKGROUND_PUMP_CHECK';
const REMINDER_HOURS_DAY = 2.5;
const REMINDER_HOURS_NIGHT = 4;

function isNightTime(date: Date): boolean {
  const hour = date.getHours();
  return hour >= 0 && hour < 6;
}

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    const logs = useLogsStore.getState().logs;
    const lastLog = logs[logs.length - 1];

    if (!lastLog) {
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    const now = new Date();
    const lastTime = new Date(lastLog.timestamp);
    const hoursSinceLast = differenceInHours(now, lastTime);
    const interval = isNightTime(now) ? REMINDER_HOURS_NIGHT : REMINDER_HOURS_DAY;

    if (hoursSinceLast < interval) {
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏱ Time to pump?',
        body: `It's been over ${interval} hours since your last pump log.`,
        sound: true,
      },
      trigger: null,
    });

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (err) {
    console.error('Pump reminder task failed:', err);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export default async function registerPumpReminder() {
  try {
    await BackgroundTask.registerTaskAsync(TASK_NAME, {
      minimumInterval: 15 * 60, // 15 minutes
    });
    console.log('Pump reminder background task registered with expo-background-task');
  } catch (err) {
    console.error('Failed to register background task:', err);
  }
}
