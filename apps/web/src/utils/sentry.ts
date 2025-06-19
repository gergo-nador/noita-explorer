import { captureException } from '@sentry/react';

const isSentryEnabled = localStorage['sentry_logger_enabled'] === '1';

export const sentry = {
  setNextStartup: (enable: boolean) => {
    localStorage['sentry_logger_enabled'] = enable ? '1' : '0';
  },
  isSentryEnabled: isSentryEnabled,
  hasSentryInitialized: false,

  captureError: (error: Error | string | unknown) => {
    if (isSentryEnabled) captureException(error);
  },
};
