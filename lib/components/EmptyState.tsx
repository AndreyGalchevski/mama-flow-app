import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { COLORS } from '../colors';

interface EmptyStateProps {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    onPress: () => void;
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
  tertiaryAction?: {
    label: string;
    onPress: () => void;
  };
  icon?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  icon,
}: EmptyStateProps) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 48,
      }}
    >
      {icon && <View style={{ marginBottom: 24, opacity: 0.6 }}>{icon}</View>}

      <Text
        variant="headlineSmall"
        style={{
          textAlign: 'center',
          marginBottom: 8,
          color: COLORS.onSurface,
        }}
      >
        {title}
      </Text>

      <Text
        variant="bodyLarge"
        style={{
          textAlign: 'center',
          marginBottom: 32,
          color: COLORS.onSurfaceVariant,
        }}
      >
        {description}
      </Text>

      <View style={{ gap: 12, width: '100%', maxWidth: 300 }}>
        <Button
          mode="contained"
          onPress={primaryAction.onPress}
          style={{ backgroundColor: COLORS.primary }}
        >
          {primaryAction.label}
        </Button>

        {secondaryAction && (
          <Button mode="outlined" onPress={secondaryAction.onPress}>
            {secondaryAction.label}
          </Button>
        )}

        {tertiaryAction && (
          <Button mode="text" onPress={tertiaryAction.onPress}>
            {tertiaryAction.label}
          </Button>
        )}
      </View>
    </View>
  );
}
