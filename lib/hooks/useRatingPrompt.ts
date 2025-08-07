import { Alert } from 'react-native';

import i18n from '../i18n';
import { openAppStore, requestReview, shouldShowRatingPrompt } from '../rating';
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
      const result = await requestReview();

      if (result.success) {
        markUserRated();

        // If we used the fallback (opened store directly), show confirmation
        if (!result.usedNativePrompt) {
          Alert.alert(i18n.t('rating.storeOpened.title'), i18n.t('rating.storeOpened.message'), [
            { text: i18n.t('common.ok') },
          ]);
        }
      } else {
        Alert.alert(i18n.t('rating.error.title'), i18n.t('rating.error.message'), [
          { text: i18n.t('common.cancel'), style: 'cancel' },
          {
            text: i18n.t('rating.error.openStore'),
            onPress: async () => {
              const storeResult = await openAppStore();
              if (storeResult.success) {
                markUserRated();
              }
            },
          },
        ]);
      }
    } catch (error) {
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
