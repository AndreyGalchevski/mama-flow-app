import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { Ripple } from '../utils/ripple';

export type FABSize = 'small' | 'medium' | 'large';

export function FAB({
  size = 'large',
  icon,
  onPress,
  style,
  children,
}: {
  size?: FABSize;
  icon?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  const t = useTheme();

  const dim = size === 'small' ? 40 : size === 'medium' ? 56 : size === 'large' ? 64 : 56;

  const radius = dim / 2;
  return (
    <Ripple
      onPress={onPress}
      style={[
        {
          backgroundColor: t.colors.primaryContainer,
          borderRadius: radius,
          paddingHorizontal: 0,
          height: dim,
          minWidth: dim,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
        },
        t.elevation.level3,
        style,
      ]}
    >
      {icon ?? children}
    </Ripple>
  );
}
