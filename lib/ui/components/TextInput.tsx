import { type ReactNode, type RefObject, useEffect, useRef, useState } from 'react';
import type { TextInputProps as RNTextInputProps, StyleProp, ViewStyle } from 'react-native';
import { Animated, Text as RNText, TextInput as RNTextInput, View } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

interface Props {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  errorText?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: RNTextInputProps['keyboardType'];
  style?: StyleProp<ViewStyle>;
  ref?: RefObject<RNTextInput>;
}

export function TextInput({
  label,
  value,
  onChangeText,
  placeholder,
  leading,
  trailing,
  errorText,
  helperText,
  error,
  disabled,
  secureTextEntry,
  multiline,
  numberOfLines = 1,
  keyboardType,
  style,
  ref,
}: Props) {
  const t = useTheme();

  const [focused, setFocused] = useState(false);

  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: focused || !!value ? 1 : 0,
      duration: 120,
      useNativeDriver: false,
    }).start();
  }, [anim, focused, value]);

  const labelTop = anim.interpolate({ inputRange: [0, 1], outputRange: [18, 6] });
  const labelSize = anim.interpolate({ inputRange: [0, 1], outputRange: [16, 12] });
  const hasError = !!errorText || !!error;
  const labelColor = hasError
    ? t.colors.error
    : focused
      ? t.colors.primary
      : t.colors.onSurfaceVariant;

  const baseBorder = hasError ? t.colors.error : focused ? t.colors.primary : t.colors.outline;

  return (
    <View style={[{ marginVertical: t.spacing(1) }, style]}>
      <View
        style={{
          borderRadius: t.shape.md,
          borderWidth: 1,
          borderColor: baseBorder,
          backgroundColor: t.colors.surface,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
          {leading}

          <View style={{ flex: 1, paddingVertical: 12 }}>
            {label ? (
              <Animated.Text
                style={{
                  position: 'absolute',
                  left: 12,
                  top: labelTop,
                  fontSize: labelSize,
                  color: labelColor,
                }}
              >
                {label}
              </Animated.Text>
            ) : null}

            <RNTextInput
              ref={ref}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              editable={!disabled}
              secureTextEntry={secureTextEntry}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              keyboardType={keyboardType}
              style={{
                color: t.colors.onSurface,
                paddingTop: label ? 18 : 0,
                paddingBottom: 0,
                minHeight: 24 * numberOfLines,
              }}
              multiline={multiline}
              numberOfLines={numberOfLines}
              placeholderTextColor={t.colors.onSurfaceVariant}
            />
          </View>

          {trailing}
        </View>
      </View>

      {errorText || helperText ? (
        <RNText
          style={[
            t.typography.bodySmall,
            { color: errorText ? t.colors.error : t.colors.onSurfaceVariant, marginTop: 4 },
          ]}
        >
          {errorText ?? helperText}
        </RNText>
      ) : null}
    </View>
  );
}
