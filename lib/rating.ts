import * as StoreReview from 'expo-store-review';

import { captureException } from './sentry';

export async function requestReview(): Promise<void> {
  try {
    const isAvailable = await StoreReview.isAvailableAsync();

    if (isAvailable) {
      await StoreReview.requestReview();
    }
  } catch (error) {
    captureException(error instanceof Error ? error : new Error('Failed to request review'), {
      context: 'rating_prompt',
    });
  }
}

export function shouldShowRatingPrompt(
  logsCount: number,
  appLaunchCount: number,
  lastRatingPromptDate: number | null,
  hasUserRated: boolean,
): boolean {
  if (hasUserRated) {
    return false;
  }

  const hasEnoughLogs = logsCount >= 10;

  const hasEnoughLaunches = appLaunchCount >= 5;

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  const hasWaitedLongEnough = !lastRatingPromptDate || lastRatingPromptDate < thirtyDaysAgo;

  return hasEnoughLogs && hasEnoughLaunches && hasWaitedLongEnough;
}
