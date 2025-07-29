import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { en, registerTranslation } from 'react-native-paper-dates';
import 'react-native-reanimated';

import { COLORS } from '../lib/colors';

registerTranslation('en', en);

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <PaperProvider theme={{ dark: false, roundness: 8, colors: COLORS }}>
      <Slot />
    </PaperProvider>
  );
}
