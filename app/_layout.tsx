import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <PaperProvider
      theme={{
        dark: false,
        roundness: 8,
        colors: {
          primary: '#4F8A8B', // Soft teal blue – calm and modern
          onPrimary: '#FFFFFF',

          secondary: '#F6C90E', // Vibrant amber – draws attention without harshness
          onSecondary: '#000000',

          background: '#FAFAFA', // Near-white with warmth
          onBackground: '#1F1F1F',

          surface: '#FFFFFF', // Clean card surfaces
          onSurface: '#1F1F1F',

          surfaceVariant: '#F0F0F0', // Slightly gray card alternative
          onSurfaceVariant: '#333333',

          elevation: {
            level0: 'transparent',
            level1: '#F4F4F4',
            level2: '#EAEAEA',
            level3: '#E0E0E0',
            level4: '#D6D6D6',
            level5: '#CCCCCC',
          },

          error: '#D9534F', // Muted red for errors
          onError: '#FFFFFF',

          outline: '#D1D1D1', // Light gray for outlines/dividers

          backdrop: 'rgba(0,0,0,0.5)',
          notification: '#FFB74D', // Subtle orange for badges/alerts
        },
      }}
    >
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </PaperProvider>
  );
}
