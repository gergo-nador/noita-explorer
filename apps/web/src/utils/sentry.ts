export const sentry = {
  setNextStartup: (enable: boolean) => {
    localStorage['sentry_logger_enabled'] = enable ? '1' : '0';
  },
  isSentryEnabled: localStorage['sentry_logger_enabled'] === '1',
  hasSentryInitialized: false,
};
