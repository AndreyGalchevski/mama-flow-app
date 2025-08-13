import * as Notifications from 'expo-notifications';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { I18nManager } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { en, he, registerTranslation, ru } from 'react-native-paper-dates';
import 'react-native-reanimated';

import { COLORS } from '../lib/colors';
import ErrorBoundary from '../lib/components/ErrorBoundary';
import WelcomeModal from '../lib/components/WelcomeModal';
import { useSettingsStore } from '../lib/hooks/useSettingsStore';
import i18n, { isRTL } from '../lib/i18n';
import {
  ACTION_START_PUMP,
  CATEGORY_IDENTIFIER,
  ensurePumpReminderCategory,
} from '../lib/reminders';

registerTranslation('en', en);
registerTranslation('ru', ru);
registerTranslation('he', he);

export default function RootLayout() {
  const incrementAppLaunchCount = useSettingsStore((state) => state.incrementAppLaunchCount);

  useEffect(() => {
    incrementAppLaunchCount();

    const rtl = isRTL();

    if (I18nManager.isRTL !== rtl) {
      I18nManager.allowRTL(rtl);
      I18nManager.forceRTL(rtl);
    }
  }, [incrementAppLaunchCount]);

  useEffect(() => {
    ensurePumpReminderCategory();

    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      try {
        const actionID = response.actionIdentifier;
        const categoryID = response.notification.request.content.categoryIdentifier;
        const notificationID = response.notification.request.identifier;

        if (categoryID !== CATEGORY_IDENTIFIER) {
          return;
        }

        if (
          actionID === ACTION_START_PUMP ||
          actionID === Notifications.DEFAULT_ACTION_IDENTIFIER
        ) {
          void Notifications.dismissNotificationAsync(notificationID);
          router.push('/add-log-modal');
        }
      } catch (e) {
        router.push('/');
      }
    });

    Notifications.getLastNotificationResponseAsync().then((response) => {
      try {
        if (!response) return;
        const actionID = response.actionIdentifier;
        const categoryID = response.notification.request.content.categoryIdentifier;
        const notificationID = response.notification.request.identifier;
        if (categoryID !== CATEGORY_IDENTIFIER) return;
        if (
          actionID === ACTION_START_PUMP ||
          actionID === Notifications.DEFAULT_ACTION_IDENTIFIER
        ) {
          void Notifications.dismissNotificationAsync(notificationID);
          router.push('/add-log-modal');
        }
      } catch {
        router.push('/');
      }
    });

    return () => {
      sub.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView>
      <ErrorBoundary>
        <PaperProvider
          theme={{
            ...MD3LightTheme,
            dark: false,
            roundness: 8,
            colors: COLORS,
          }}
        >
          <StatusBar style="dark" />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="add-log-modal"
              options={{ presentation: 'modal', title: i18n.t('logs.newPumpLog') }}
            />
            <Stack.Screen
              name="edit-log/[id]"
              options={{ presentation: 'modal', title: i18n.t('logs.updatePumpLog') }}
            />
            <Stack.Screen
              name="import-csv-modal"
              options={{ presentation: 'modal', title: i18n.t('csv.importTitle') }}
            />
            <Stack.Screen
              name="night-time-modal"
              options={{ presentation: 'modal', title: i18n.t('settings.nightIntervalTitle') }}
            />
          </Stack>

          <WelcomeModal />
        </PaperProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
