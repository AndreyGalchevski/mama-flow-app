import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { en, registerTranslation } from 'react-native-paper-dates';
import 'react-native-reanimated';

import { COLORS } from '../lib/colors';
import ErrorBoundary from '../lib/components/ErrorBoundary';
import { initSentry } from '../lib/sentry';

registerTranslation('en', en);

export default function RootLayout() {
  // Initialize Sentry for error tracking
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
            options={{ presentation: 'modal', title: 'New Pump Log' }}
          />
          <Stack.Screen
            name="edit-log/[id]"
            options={{ presentation: 'modal', title: 'Update Pump Log' }}
          />
          <Stack.Screen
            name="import-csv-modal"
            options={{ presentation: 'modal', title: 'Import CSV' }}
          />
        </Stack>
      </PaperProvider>
    </ErrorBoundary>
  );
}
