import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { en, registerTranslation, ru } from 'react-native-paper-dates';
import 'react-native-reanimated';

import { COLORS } from '../lib/colors';
import ErrorBoundary from '../lib/components/ErrorBoundary';
import WelcomeModal from '../lib/components/WelcomeModal';
import i18n from '../lib/i18n';
import { initSentry } from '../lib/sentry';

registerTranslation('en', en);
registerTranslation('ru', ru);

export default function RootLayout() {
  useEffect(() => {
    initSentry();
  }, []);

  return (
    <ErrorBoundary>
      <PaperProvider theme={{ dark: false, roundness: 8, colors: COLORS }}>
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
        </Stack>

        <WelcomeModal />
      </PaperProvider>
    </ErrorBoundary>
  );
}
