import { StrictMode } from 'react';
import { createRoot, RootOptions } from 'react-dom/client';
import './index.css';
import { App } from './app.tsx';
import { sentry } from './utils/sentry.ts';

let rootErrorHandling: RootOptions = {
  onUncaughtError: (
    error: unknown,
    errorInfo: { componentStack?: string | undefined },
  ) => {
    console.error('Uncaught error: ', error, errorInfo);
  },
};

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentry.isSentryEnabled && sentryDsn) {
  import('@sentry/react')
    .then(
      (Sentry) => {
        Sentry.init({
          dsn: sentryDsn,
          sendDefaultPii: false,
          debug: __ENV__ === 'development',
          environment: __ENV__,
          ignoreErrors: [
            // the user needs to grant permission to access their file system, nothing we can do here
            "Failed to execute 'getDirectoryHandle' on 'FileSystemDirectoryHandle': The request is not allowed by the user agent or the platform in the current context.",
          ],
        });
        sentry.hasSentryInitialized = true;

        rootErrorHandling = {
          // Callback called when an error is thrown and not caught by an Error Boundary.
          onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
            console.warn('Uncaught error', error, errorInfo.componentStack);
          }),
          // Callback called when React catches an error in an Error Boundary.
          onCaughtError: Sentry.reactErrorHandler(),
          // Callback called when React automatically recovers from errors.
          onRecoverableError: Sentry.reactErrorHandler(),
        };
      },
      () => {
        console.error('Failed to import Sentry');
      },
    )
    .catch(() => {
      console.error('Failed to initialize Sentry');
    })
    .then(() => {
      startApp();
    });
} else {
  startApp();
}

function startApp() {
  const container = document.getElementById('root')!;
  const root = createRoot(container, rootErrorHandling);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
