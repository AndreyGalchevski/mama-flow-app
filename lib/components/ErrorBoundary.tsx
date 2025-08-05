import React, { type ReactNode } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { COLORS } from '../colors';
import { captureException } from '../sentry';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    // Send error to Sentry with component stack trace
    captureException(error, {
      errorBoundary: true,
      componentStack: errorInfo.componentStack || 'No component stack available',
      errorStack: error.stack || 'No stack trace available',
    });
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 32,
          backgroundColor: COLORS.background,
        }}
      >
        <Text
          variant="headlineSmall"
          style={{
            textAlign: 'center',
            marginBottom: 16,
            color: COLORS.error,
          }}
        >
          Something went wrong
        </Text>

        <Text
          variant="bodyLarge"
          style={{
            textAlign: 'center',
            marginBottom: 32,
            color: COLORS.onSurfaceVariant,
          }}
        >
          The app encountered an unexpected error. Please try restarting the app.
        </Text>

        <Button
          mode="contained"
          onPress={() => this.setState({ hasError: false, error: undefined })}
          style={{ backgroundColor: COLORS.primary }}
        >
          Try Again
        </Button>

        {__DEV__ && this.state.error && (
          <Text
            variant="bodySmall"
            style={{
              marginTop: 16,
              padding: 16,
              backgroundColor: COLORS.surfaceVariant,
              fontFamily: 'monospace',
              fontSize: 10,
            }}
          >
            {this.state.error.toString()}
          </Text>
        )}
      </View>
    );
  }
}
