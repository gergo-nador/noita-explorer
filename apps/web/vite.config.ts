import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mkcert(),
    sentryVitePlugin({
      org: 'noita-explorer',
      project: 'javascript-react',
      telemetry: true,
    }),
  ],

  server: {
    port: 4000,
  },

  build: {
    sourcemap: true,
  },
});
