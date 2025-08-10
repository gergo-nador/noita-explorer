import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({ include: ['src'], tsconfigPath: 'tsconfig.build.json' }),
    viteStaticCopy({
      targets: [
        {
          src: 'assets/*',
          dest: 'media',
        },
      ],
    }),
  ],
  build: {
    lib: {
      entry: resolve('src/main.tsx'),
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      },
    },
    chunkSizeWarningLimit: 10_000,
  },
});
