import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import { execSync } from 'child_process';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const deployIds = getDeployIds();
  const environment = getEnvironment({ mode });

  return {
    base: '/',
    plugins: [react(), mkcert()],

    server: {
      port: 4000,
    },
    define: {
      __DEPLOY_ID__: JSON.stringify(deployIds.short),
      __DEPLOY_COMMIT__: JSON.stringify(deployIds.long),
      __ENV__: JSON.stringify(environment),
    },

    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name][extname]',
          entryFileNames: '[name].[format].js',
        },
        // exclude all
        external: ['jimp', 'omggif', 'canvas', /images\.node-/, /gif\.node-/],
      },
    },
  };
});

function getDeployIds() {
  const run = (command: string) => execSync(command).toString().trim();

  const commitHashShort = 'git rev-parse --short HEAD';
  const commitHashLong = 'git rev-parse HEAD';

  return {
    short: run(commitHashShort),
    long: run(commitHashLong),
  };
}

function getEnvironment({ mode }: { mode: string }) {
  const VITE_ENV = process.env.VITE_ENV ?? loadEnv(mode, '.').VITE_ENV;
  const environments = ['production', 'preview', 'development'];

  if (environments.includes(VITE_ENV)) {
    return VITE_ENV;
  }

  return 'development';
}
