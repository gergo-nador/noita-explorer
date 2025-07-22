import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import { execSync } from 'child_process';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const deployIds = getDeployInfo();
  const environment = getEnvironment({ mode });

  return {
    base: '/',
    plugins: [react(), mkcert()],

    server: {
      port: 4000,
    },
    define: {
      __DEPLOY_ID__: JSON.stringify(deployIds.id),
      __DEPLOY_TIME__: JSON.stringify(deployIds.time),
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

function getDeployInfo() {
  const run = (command: string) => execSync(command).toString().trim();

  const commitHashShort = 'git rev-parse --short HEAD';

  return {
    id: run(commitHashShort),
    time: new Date().getTime(),
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
