import { StrictMode } from 'react';
import { createRoot, RootOptions } from 'react-dom/client';
import './index.css';
import { App } from './app.tsx';
import { environment } from './environment.ts';

// TODO: be able to enable this in the settings
let rootErrorHandling: RootOptions = {
  onUncaughtError: (
    error: unknown,
    errorInfo: { componentStack?: string | undefined },
  ) => {
    console.error('Uncaught error: ', error, errorInfo);
  },
};

const val = 1;
if (val === 1) {
  import('@sentry/react')
    .then(
      (Sentry) => {
        Sentry.init({
          dsn: import.meta.env.VITE_SENTRY_DSN,
          sendDefaultPii: true,
          debug: true,
          environment: environment,
        });

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
