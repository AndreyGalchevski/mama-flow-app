import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { en, registerTranslation } from 'react-native-paper-dates';
import 'react-native-reanimated';

import { COLORS } from '../lib/colors';

registerTranslation('en', en);

export default function RootLayout() {
  return (
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
  );
}
