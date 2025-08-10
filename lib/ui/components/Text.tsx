import type { ReactNode } from 'react';
import { Text as RNText, type TextStyle } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

type Variant =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall';

export function Text({
  variant = 'bodyMedium',
  style,
  children,
  ...rest
}: { variant?: Variant; style?: TextStyle; children: ReactNode } & Omit<
  React.ComponentProps<typeof RNText>,
  'style'
>) {
  const t = useTheme();
  return (
    <RNText {...rest} style={[t.typography[variant], { color: t.colors.onSurface }, style]}>
      {children}
    </RNText>
  );
}
