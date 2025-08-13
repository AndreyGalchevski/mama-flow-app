import * as Linking from 'expo-linking';
import * as StoreReview from 'expo-store-review';
import { Platform } from 'react-native';

/**
 * Shows the native app rating prompt if available, otherwise opens the store
 */
export async function requestReview(): Promise<{ success: boolean; usedNativePrompt: boolean }> {
  try {
    const isAvailable = await StoreReview.isAvailableAsync();

    if (isAvailable) {
      await StoreReview.requestReview();
      // Native prompt was requested (but system may not have shown it)
      return { success: true, usedNativePrompt: true };
    }

    // Fallback to opening store directly
    return await openAppStore();
  } catch (error) {
    console.error('Failed to request review:', error);
    // Try fallback to store
    return await openAppStore();
  }
}

/**
 * Opens the app store directly for rating
 */
export async function openAppStore(): Promise<{ success: boolean; usedNativePrompt: boolean }> {
  try {
    if (Platform.OS === 'ios') {
      // Replace with your actual App Store ID when published
      const appStoreUrl = 'https://apps.apple.com/app/id1234567890?action=write-review';
      await Linking.openURL(appStoreUrl);
    } else if (Platform.OS === 'android') {
      const playStoreUrl = 'market://details?id=com.soyrage.mamaflow';
      const canOpen = await Linking.canOpenURL(playStoreUrl);

      if (canOpen) {
        await Linking.openURL(playStoreUrl);
      } else {
        // Fallback to web version
        await Linking.openURL('https://play.google.com/store/apps/details?id=com.soyrage.mamaflow');
      }
    }
    return { success: true, usedNativePrompt: false };
  } catch (error) {
    console.error('Failed to open app store:', error);
    return { success: false, usedNativePrompt: false };
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

/**
 * Development helper: Test store opening directly
 * Use this to verify the store links work correctly
 */
export async function testStoreLink(): Promise<void> {
  if (__DEV__) {
    console.log('Testing store link...');
    const result = await openAppStore();
    console.log('Store link test result:', result);
  }
}
