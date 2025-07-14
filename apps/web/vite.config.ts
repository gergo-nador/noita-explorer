import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), mkcert()],

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
      external: ['jimp', 'omggif', 'canvas', /images\.node-/, /gif\.node-/],
    },
  },
});
