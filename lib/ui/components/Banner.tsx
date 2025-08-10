import React, { type ReactNode, useState } from 'react';
import { LayoutAnimation, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from './Button';

export function Banner({
  icon,
  text,
  children,
  actions,
  dismissable = true,
  initiallyVisible = true,
}: {
  icon?: ReactNode;
  text?: string;
  children?: ReactNode;
  actions?: ReactNode;
  dismissable?: boolean;
  initiallyVisible?: boolean;
}) {
  const t = useTheme();
  const [visible, setVisible] = useState(initiallyVisible);
  if (!visible) return null;
  return (
    <View
      style={{
        backgroundColor: t.colors.secondaryContainer,
        borderRadius: t.shape.lg,
        padding: t.spacing(2),
        marginVertical: t.spacing(1),
      }}
    >
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
        {icon}
        <View style={{ flex: 1 }}>
          {text ? (
            <Text style={[t.typography.bodyLarge, { color: t.colors.onSecondaryContainer }]}>
              {text}
            </Text>
          ) : (
            children
          )}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: t.spacing(1) }}>{actions}</View>
        </View>
        {dismissable ? (
          <Button
            variant="text"
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setVisible(false);
            }}
          >
            Dismiss
          </Button>
        ) : null}
      </View>
    </View>
  );
}
