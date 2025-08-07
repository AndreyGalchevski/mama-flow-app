import { requestReview, shouldShowRatingPrompt } from '../rating';
import { useLogsStore } from './useLogsStore';
import { useSettingsStore } from './useSettingsStore';

export function useRatingPrompt() {
  const logs = useLogsStore((state) => state.logs);
  const appLaunchCount = useSettingsStore((state) => state.appLaunchCount);
  const lastRatingPromptDate = useSettingsStore((state) => state.lastRatingPromptDate);
  const hasUserRated = useSettingsStore((state) => state.hasUserRated);
  const markRatingPromptShown = useSettingsStore((state) => state.markRatingPromptShown);
  const markUserRated = useSettingsStore((state) => state.markUserRated);

  const showRatingPrompt = async () => {
    try {
      await requestReview();
      markUserRated();
    } catch (error) {
      // Silently fail - rating prompts should not interrupt user experience
      console.warn('Failed to show rating prompt:', error);
    }
  };

  const checkAndShowRatingPrompt = async () => {
    const shouldShow = shouldShowRatingPrompt(
      logs.length,
      appLaunchCount,
      lastRatingPromptDate,
      hasUserRated,
    );

    if (shouldShow) {
      markRatingPromptShown();
      await showRatingPrompt();
    }
  };

  return {
    showRatingPrompt,
    checkAndShowRatingPrompt,
    shouldShowPrompt: shouldShowRatingPrompt(
      logs.length,
      appLaunchCount,
      lastRatingPromptDate,
      hasUserRated,
    ),
  };
}
