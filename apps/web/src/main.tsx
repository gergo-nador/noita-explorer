import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './app.tsx';
import * as Sentry from '@sentry/react';
import { environment } from './environment.ts';

// TODO: be able to enable this in the settings
Sentry.init({
  dsn: import.meta.env.VITE_ENV,
  sendDefaultPii: true,
  debug: true,
  environment: environment,
});

const container = document.getElementById('root')!;
const root = createRoot(container, {
  // Callback called when an error is thrown and not caught by an Error Boundary.
  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
    console.warn('Uncaught error', error, errorInfo.componentStack);
  }),
  // Callback called when React catches an error in an Error Boundary.
  onCaughtError: Sentry.reactErrorHandler(),
  // Callback called when React automatically recovers from errors.
  onRecoverableError: Sentry.reactErrorHandler(),
});

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
