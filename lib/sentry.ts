import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

export const initSentry = () => {
  if (!__DEV__) {
    Sentry.init({
      dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || Constants.expoConfig?.extra?.sentryDsn,
      tracesSampleRate: 0.1,
      enableAutoSessionTracking: true,
      enableNativeCrashHandling: true,
      environment: __DEV__ ? 'development' : 'production',
      release: Constants.expoConfig?.version || '1.0.0',
      beforeSend(event) {
        if (event.user) {
          event.user = undefined;
        }

        if (event.breadcrumbs) {
          event.breadcrumbs = event.breadcrumbs.filter((breadcrumb) => {
            return breadcrumb.category === 'error' || breadcrumb.category === 'navigation';
          });
        }

        if (event.contexts?.app?.app_memory) {
          event.contexts.app.app_memory = undefined;
        }

        if (event.request?.url) {
          event.request.url = undefined;
        }

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
