import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
import type { AccessibilityProps, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

export type CardVariant = 'elevated' | 'filled' | 'outlined';

interface Props extends AccessibilityProps {
  variant?: CardVariant;
  style?: ViewStyle | ViewStyle[];
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
}

export function Card({
  variant = 'elevated',
  style,
  header,
  footer,
  children,
  onPress,
  onLongPress,
  disabled,
}: Props) {
  const t = useTheme();
  const [active, setActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const base: ViewStyle = {
    backgroundColor: variant === 'filled' ? t.colors.surfaceContainerHighest : t.colors.surface,
    borderRadius: t.shape.xl,
  };

  const border =
    variant === 'outlined'
      ? { borderWidth: StyleSheet.hairlineWidth, borderColor: t.colors.outline }
      : null;

  const elevation = variant === 'elevated' ? t.elevation.level1 : t.elevation.level0;

  const content = (
    <>
      {header ? (
        <View style={{ padding: t.spacing(2), paddingBottom: t.spacing(1) }}>{header}</View>
      ) : null}
      <View style={{ padding: t.spacing(2) }}>{children}</View>
      {footer ? (
        <View style={{ padding: t.spacing(2), paddingTop: t.spacing(1) }}>{footer}</View>
      ) : null}
    </>
  );

  const interactive = !!(onPress || onLongPress);
  if (!interactive) {
    return <View style={[base, elevation, border || undefined, style]}>{content}</View>;
  }

  const startActive = () => {
    // Defer active state to avoid flashes during scrolls
    timerRef.current = setTimeout(() => setActive(true), 120);
  };
  const clearActive = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setActive(false);
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={startActive}
      onPressOut={clearActive}
      style={() => [
        base,
        border || undefined,
        variant === 'elevated'
          ? active
            ? t.elevation.level2
            : t.elevation.level1
          : t.elevation.level0,
        { overflow: 'hidden' },
        disabled ? { opacity: 0.6 } : null,
        Array.isArray(style) ? style : style ? [style] : [],
      ]}
    >
      <View style={{ position: 'relative' }}>
        {content}
        {active ? (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: `${t.colors.onSurfaceVariant}1A`,
            }}
          />
        ) : null}
      </View>
    </Pressable>
  );
}
