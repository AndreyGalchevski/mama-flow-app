import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo } from 'react';
import { I18nManager, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MD3DarkTheme, MD3LightTheme, PaperProvider, Snackbar } from 'react-native-paper';
import { en, he, registerTranslation, ru } from 'react-native-paper-dates';
import 'react-native-reanimated';

import { COLORS, DARK_COLORS } from '../lib/colors';
import ErrorBoundary from '../lib/components/ErrorBoundary';
import WelcomeModal from '../lib/components/WelcomeModal';
import { useSettingsStore } from '../lib/hooks/useSettingsStore';
import { useSnackbarStore } from '../lib/hooks/useSnackbarStore';
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
  const isSnackbarVisible = useSnackbarStore((s) => s.isSnackbarVisible);
  const snackbarType = useSnackbarStore((s) => s.snackbarType);
  const snackbarMessage = useSnackbarStore((s) => s.snackbarMessage);
  const hideSnackbar = useSnackbarStore((s) => s.hideSnackbar);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const theme = useMemo(() => {
    return isDark
      ? {
          ...MD3DarkTheme,
          dark: true,
          roundness: 8,
          colors: {
            ...MD3DarkTheme.colors,
            ...DARK_COLORS,
          },
        }
      : {
          ...MD3LightTheme,
          dark: false,
          roundness: 8,
          colors: {
            ...MD3LightTheme.colors,
            ...COLORS,
          },
        };
  }, [isDark]);

  const navTheme = useMemo(() => {
    const base = isDark ? NavDarkTheme : NavLightTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.onSurface,
        border: theme.colors.outlineVariant || theme.colors.outline || base.colors.border,
        notification: theme.colors.error || base.colors.notification,
      },
    };
  }, [isDark, theme]);

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
    <>
      <GestureHandlerRootView>
        <ErrorBoundary>
          <PaperProvider theme={theme}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <NavigationThemeProvider value={navTheme}>
              <Stack
                screenOptions={{
                  headerStyle: { backgroundColor: navTheme.colors.card },
                  headerTintColor: navTheme.colors.text,
                  contentStyle: { backgroundColor: navTheme.colors.background },
                }}
              >
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
            </NavigationThemeProvider>

            <WelcomeModal />

            <Snackbar visible={isSnackbarVisible} onDismiss={hideSnackbar}>
              {snackbarMessage}
            </Snackbar>
          </PaperProvider>
        </ErrorBoundary>
      </GestureHandlerRootView>
    </>
  );
}
