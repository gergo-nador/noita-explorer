import { defineConfig, loadEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import { execSync } from 'child_process';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  const deployInfo = getDeployInfo();
  const environment = getEnvironment({ mode });

  const isLibMode = mode === 'lib';

  return {
    base: '/',
    plugins: [
      react(),
      mkcert(),
      viteStaticCopy({
        targets: [
          {
            src: '../../node_modules/@noita-explorer/noita-component-library/dist/media/*',
            dest: 'noita-component-library',
          },
        ],
      }),
    ],

    server: {
      port: 4000,
    },
    define: {
      __DEPLOY_ID__: JSON.stringify(deployInfo.id),
      __DEPLOY_TIME__: JSON.stringify(deployInfo.time),
      __ENV__: JSON.stringify(environment),
      __SSG__: JSON.stringify(isLibMode),
    },

    build: {
      lib: isLibMode && {
        entry: {
          routes: resolve(__dirname, 'scripts/sitemap/routes.export.ts'),
          ssg: resolve(__dirname, 'scripts/ssg/render-route-ssg.export.tsx'),
        },
        formats: ['es', 'cjs'],
        fileName: (format, entryName) => `${entryName}.${format}.js`,
      },
      outDir: isLibMode ? 'dist-lib' : 'dist',
      minify: !isLibMode,
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
    worker: {
      format: 'es',
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
