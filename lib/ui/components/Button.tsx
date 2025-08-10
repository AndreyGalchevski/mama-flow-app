import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Ripple } from '../utils/ripple';

export type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text' | 'elevated';
export type ButtonSize = 'sm' | 'md' | 'lg';

export function Button({
  variant = 'filled',
  size = 'md',
  disabled,
  loading,
  icon,
  trailing,
  onPress,
  style,
  children,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  const t = useTheme();

  const { bg, fg, border, elevation } = (() => {
    switch (variant) {
      case 'filled':
        return {
          bg: t.colors.primary,
          fg: t.colors.onPrimary,
          border: 'transparent',
          elevation: t.elevation.level0,
        };
      case 'tonal':
        return {
          bg: t.colors.secondaryContainer,
          fg: t.colors.onSecondaryContainer,
          border: 'transparent',
          elevation: t.elevation.level0,
        };
      case 'outlined':
        return {
          bg: 'transparent',
          fg: t.colors.primary,
          border: t.colors.outline,
          elevation: t.elevation.level0,
        };
      case 'text':
        return {
          bg: 'transparent',
          fg: t.colors.primary,
          border: 'transparent',
          elevation: t.elevation.level0,
        };
      case 'elevated':
        return {
          bg: t.colors.surface,
          fg: t.colors.primary,
          border: 'transparent',
          elevation: t.elevation.level1,
        };
    }
  })();

  const paddings = { sm: 10, md: 14, lg: 18 } as const;
  const radius = t.shape.lg;

  const content = (
    <View style={[styles.row, { gap: 8, alignItems: 'center', justifyContent: 'center' }]}>
      {loading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : (
        <>
          {icon}
          {typeof children === 'string' ? (
            <Text style={[t.typography.labelLarge, { color: fg }]}>{children}</Text>
          ) : (
            children
          )}
          {trailing}
        </>
      )}
    </View>
  );

  return (
    <Ripple
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          paddingVertical: paddings[size],
          paddingHorizontal: 20,
          borderRadius: radius,
          backgroundColor: bg,
          opacity: disabled ? 0.38 : 1,
        },
        variant === 'outlined' && { borderWidth: StyleSheet.hairlineWidth, borderColor: border },
        elevation,
        style,
      ]}
    >
      {content}
    </Ripple>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
});
