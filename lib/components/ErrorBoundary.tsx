import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const theme = useTheme();

    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, padding: 32 }]}>
        <Text variant="headlineSmall" style={styles.title}>
          Something went wrong
        </Text>

        <Text variant="bodyLarge" style={styles.description}>
          The app encountered an unexpected error. Please try restarting the app.
        </Text>

        <Button
          mode="contained"
          onPress={() => this.setState({ hasError: false, error: undefined })}
          style={styles.button}
        >
          Try Again
        </Button>

        {__DEV__ && this.state.error && (
          <Text variant="bodySmall" style={styles.errorText}>
            {this.state.error.toString()}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    // dynamic color from Paper button variant
  },
  errorText: {
    marginTop: 16,
    padding: 16,
    fontFamily: 'monospace',
    fontSize: 10,
  },
});
