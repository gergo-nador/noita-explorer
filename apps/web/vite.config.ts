import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      mkcert(),
      sentryVitePlugin({
        org: 'noita-explorer',
        project: 'javascript-react',
        telemetry: false,
        // don't upload source maps when the sentry auth token is not present
        disable: !env.VITE_SENTRY_AUTH_TOKEN,
        authToken: env.VITE_SENTRY_AUTH_TOKEN,
        sourcemaps: { disable: true },
        bundleSizeOptimizations: {
          excludeDebugStatements: true,
          excludeTracing: true,
          excludeReplayIframe: true,
          excludeReplayShadowDom: true,
          excludeReplayWorker: true,
        },
        debug: true,
      }),
    ],

    server: {
      port: 4000,
    },

    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name][extname]',
          entryFileNames: '[name].[format].js',
        },
        // exclude all
        external: ['jimp', 'omggif', 'canvas', /\.node/],
      },
    },
  };
});
