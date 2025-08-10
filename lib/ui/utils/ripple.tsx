import { type ReactNode, useRef, useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Platform, Pressable, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type PressableStyle =
  | StyleProp<ViewStyle>
  | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);

export function Ripple({
  style,
  disabled,
  onPress,
  onLongPress,
  pressInDelayMs = 120,
  children,
}: {
  style?: PressableStyle;
  disabled?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  pressInDelayMs?: number;
  children: ReactNode;
}) {
  const { colors } = useTheme();
  const [showFeedback, setShowFeedback] = useState(false);
  const pressedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePressIn = () => {
    pressedRef.current = true;
    timerRef.current = setTimeout(() => {
      if (pressedRef.current) setShowFeedback(true);
    }, pressInDelayMs);
  };

  const clear = () => {
    pressedRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setShowFeedback(false);
  };

  return (
    <Pressable
      style={(state) => [
        typeof style === 'function' ? style(state) : style,
        Platform.OS === 'ios' && showFeedback ? { opacity: 0.7 } : null,
      ]}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={clear}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={{ position: 'relative' }}>
        {children}
        {showFeedback ? (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: `${colors.onSurfaceVariant}1A`,
            }}
          />
        ) : null}
      </View>
    </Pressable>
  );
}
