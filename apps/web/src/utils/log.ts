import { sentry } from './sentry.ts';
import * as Sentry from '@sentry/react';

interface Logger {
  fatal: (message: string, attributes?: Record<string, unknown>) => void;
  error: (message: string, attributes?: Record<string, unknown>) => void;
}

export const logger: Logger = {
  fatal: (message, attributes) => {
    if (sentry.isSentryEnabled) {
      Sentry.logger.fatal(message, attributes);
    } else {
      console.error('Fatal Error: ', message, attributes);
    }
  },
  error: (message, attributes) => {
    if (sentry.isSentryEnabled) {
      Sentry.logger.error(message, attributes);
    } else {
      console.error(message, attributes);
    }
  },
};
