import type { TextStyle, ViewStyle } from 'react-native';
import { Platform } from 'react-native';
import { COLORS } from '../../colors';

export type ColorRoles = {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;

  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;

  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;

  surfaceContainer: string; // M3 expressive adds extra containers
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
};

export type Elevation = {
  level0: ViewStyle;
  level1: ViewStyle;
  level2: ViewStyle;
  level3: ViewStyle;
  level4: ViewStyle;
  level5: ViewStyle;
};

export type Typography = {
  displayLarge: TextStyle;
  displayMedium: TextStyle;
  displaySmall: TextStyle;
  headlineLarge: TextStyle;
  headlineMedium: TextStyle;
  headlineSmall: TextStyle;
  titleLarge: TextStyle;
  titleMedium: TextStyle;
  titleSmall: TextStyle;
  bodyLarge: TextStyle;
  bodyMedium: TextStyle;
  bodySmall: TextStyle;
  labelLarge: TextStyle;
  labelMedium: TextStyle;
  labelSmall: TextStyle;
};

export type ThemeTokens = {
  colors: ColorRoles;
  elevation: Elevation;
  typography: Typography;
  shape: { xs: number; sm: number; md: number; lg: number; xl: number; round: number };
  spacing: (n?: number) => number;
  isDark: boolean;
};

const fontFamily = Platform.select({ ios: 'SF Pro Text', android: 'sans-serif' });

export const createTypography = (): Typography => ({
  displayLarge: { fontFamily, fontSize: 57, lineHeight: 64, letterSpacing: 0 },
  displayMedium: { fontFamily, fontSize: 45, lineHeight: 52, letterSpacing: 0 },
  displaySmall: { fontFamily, fontSize: 36, lineHeight: 44, letterSpacing: 0 },
  headlineLarge: { fontFamily, fontSize: 32, lineHeight: 40, letterSpacing: 0 },
  headlineMedium: { fontFamily, fontSize: 28, lineHeight: 36, letterSpacing: 0 },
  headlineSmall: { fontFamily, fontSize: 24, lineHeight: 32, letterSpacing: 0 },
  titleLarge: { fontFamily, fontSize: 22, lineHeight: 28, letterSpacing: 0.1 },
  titleMedium: { fontFamily, fontSize: 16, lineHeight: 24, letterSpacing: 0.15, fontWeight: '600' },
  titleSmall: { fontFamily, fontSize: 14, lineHeight: 20, letterSpacing: 0.1, fontWeight: '600' },
  bodyLarge: { fontFamily, fontSize: 16, lineHeight: 24, letterSpacing: 0.5 },
  bodyMedium: { fontFamily, fontSize: 14, lineHeight: 20, letterSpacing: 0.25 },
  bodySmall: { fontFamily, fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
  labelLarge: { fontFamily, fontSize: 14, lineHeight: 20, letterSpacing: 0.1, fontWeight: '600' },
  labelMedium: { fontFamily, fontSize: 12, lineHeight: 16, letterSpacing: 0.5, fontWeight: '600' },
  labelSmall: { fontFamily, fontSize: 11, lineHeight: 16, letterSpacing: 0.5, fontWeight: '600' },
});

export const lightColors: ColorRoles = {
  // Brand
  primary: COLORS.primary,
  onPrimary: COLORS.onPrimary,
  primaryContainer: COLORS.surfaceVariant,
  onPrimaryContainer: COLORS.onSurface,

  // Secondary (mapped to brand secondary)
  secondary: COLORS.secondary,
  onSecondary: COLORS.onSecondary,
  secondaryContainer: COLORS.surfaceVariant,
  onSecondaryContainer: COLORS.onSurface,

  // Tertiary (fallback to secondary palette)
  tertiary: COLORS.secondary,
  onTertiary: COLORS.onSecondary,
  tertiaryContainer: COLORS.surfaceVariant,
  onTertiaryContainer: COLORS.onSurface,

  // Error
  error: COLORS.error,
  onError: COLORS.onError,
  errorContainer: COLORS.surfaceVariant,
  onErrorContainer: COLORS.onSurface,

  // Surfaces
  surface: COLORS.surface,
  onSurface: COLORS.onSurface,
  surfaceVariant: COLORS.surfaceVariant,
  onSurfaceVariant: COLORS.onSurfaceVariant,
  outline: COLORS.outline,
  outlineVariant: COLORS.surfaceVariant,

  // Inverse
  inverseSurface: COLORS.onSurface,
  inverseOnSurface: COLORS.surface,
  inversePrimary: COLORS.primary,

  // Expressive containers
  surfaceContainer: COLORS.background,
  surfaceContainerHigh: COLORS.surfaceVariant,
  surfaceContainerHighest: COLORS.surface,
};

export const darkColors: ColorRoles = {
  // Brand (reuse brand accents)
  primary: COLORS.primary,
  onPrimary: COLORS.onPrimary,
  primaryContainer: '#2B2B2B',
  onPrimaryContainer: '#FAFAFA',

  secondary: COLORS.secondary,
  onSecondary: COLORS.onSecondary,
  secondaryContainer: '#2B2B2B',
  onSecondaryContainer: '#FAFAFA',

  tertiary: COLORS.secondary,
  onTertiary: COLORS.onSecondary,
  tertiaryContainer: '#2B2B2B',
  onTertiaryContainer: '#FAFAFA',

  // Error
  error: COLORS.error,
  onError: COLORS.onError,
  errorContainer: '#2B2B2B',
  onErrorContainer: '#FAFAFA',

  // Surfaces (dark neutrals)
  surface: '#1F1F1F',
  onSurface: '#FAFAFA',
  surfaceVariant: '#333333',
  onSurfaceVariant: '#CCCCCC',
  outline: '#555555',
  outlineVariant: '#444444',

  // Inverse
  inverseSurface: COLORS.surface,
  inverseOnSurface: COLORS.onSurface,
  inversePrimary: COLORS.primary,

  // Expressive containers
  surfaceContainer: '#212121',
  surfaceContainerHigh: '#262626',
  surfaceContainerHighest: '#2B2B2B',
};

export const createElevation = (isDark: boolean): Elevation => ({
  level0: { shadowColor: '#00000000', elevation: 0 },
  level1: {
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.3 : 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  level2: {
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.35 : 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  level3: {
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.4 : 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  level4: {
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.45 : 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 8,
  },
  level5: {
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.5 : 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 12,
  },
});

export const createTokens = (isDark = false): ThemeTokens => ({
  colors: isDark ? darkColors : lightColors,
  elevation: createElevation(isDark),
  typography: createTypography(),
  shape: { xs: 4, sm: 8, md: 12, lg: 16, xl: 28, round: 999 },
  spacing: (n = 1) => 8 * n,
  isDark,
});
