import { type ReactNode, createContext, useContext, useMemo } from 'react';
import { Appearance } from 'react-native';
import { type ThemeTokens, createTokens } from './tokens';

const ThemeContext = createContext<{ theme: ThemeTokens }>({
  theme: createTokens(false),
});

export function ThemeProvider({
  initialDark,
  children,
}: { initialDark?: boolean; children: ReactNode }) {
  const systemDark = Appearance.getColorScheme() === 'dark';

  const dark = initialDark ?? systemDark;

  const value = useMemo(() => ({ theme: createTokens(dark) }), [dark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext).theme;
