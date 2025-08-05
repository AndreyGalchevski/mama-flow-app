import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

export const initSentry = () => {
  if (!__DEV__) {
    Sentry.init({
      dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || Constants.expoConfig?.extra?.sentryDsn,
      tracesSampleRate: 1.0,
      enableAutoSessionTracking: true,
      enableNativeCrashHandling: true,
      environment: __DEV__ ? 'development' : 'production',
      release: Constants.expoConfig?.version || '1.0.0',
      beforeSend(event) {
        return event;
      },
    });
  }
};

export const captureException = (
  error: Error,
  context?: Record<string, string | number | boolean>,
) => {
  if (!__DEV__) {
    Sentry.withScope((scope) => {
      if (context) {
        for (const [key, value] of Object.entries(context)) {
          scope.setTag(key, String(value));
        }
      }
      Sentry.captureException(error);
    });
  } else {
    console.error('Error (would be sent to Sentry in production):', error, context);
  }
};

export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  if (!__DEV__) {
    Sentry.captureMessage(message, level);
  } else {
    console.log(`Sentry message (${level}):`, message);
  }
};

export const setUser = (user: {
  id?: string;
  [key: string]: string | number | boolean | undefined;
}) => {
  if (!__DEV__) {
    Sentry.setUser(user);
  }
};

export const addBreadcrumb = (breadcrumb: {
  message: string;
  category?: string;
  level?: Sentry.SeverityLevel;
  data?: Record<string, string | number | boolean>;
}) => {
  if (!__DEV__) {
    Sentry.addBreadcrumb(breadcrumb);
  }
};
