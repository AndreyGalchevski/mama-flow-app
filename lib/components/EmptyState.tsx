import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
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
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}

      <Text variant="headlineSmall" style={styles.title}>
        {title}
      </Text>

      <Text variant="bodyLarge" style={styles.description}>
        {description}
      </Text>

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={primaryAction.onPress} style={styles.primaryButton}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconContainer: {
    marginBottom: 24,
    opacity: 0.6,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: COLORS.onSurface,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    color: COLORS.onSurfaceVariant,
  },
  buttonContainer: {
    gap: 12,
    width: '100%',
    maxWidth: 300,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
});
