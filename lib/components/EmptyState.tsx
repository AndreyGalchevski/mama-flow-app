import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

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
  const theme = useTheme();
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}

      <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
        {title}
      </Text>

      <Text
        variant="bodyLarge"
        style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
      >
        {description}
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={primaryAction.onPress}
          style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
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
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 12,
    width: '100%',
    maxWidth: 300,
  },
  primaryButton: {},
});
