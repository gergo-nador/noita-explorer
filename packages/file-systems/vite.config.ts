import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ include: ['src'] })],
  build: {
    lib: {
      entry: {
        main: resolve(__dirname, 'src/main.ts'),
        'browser-fallback': resolve(__dirname, 'src/browser-fallback/main.ts'),
        'data-wak-memory-filesystem': resolve(
          __dirname,
          'src/data-wak-memory-filesystem/main.ts',
        ),
        'browser-file-access-api': resolve(
          __dirname,
          'src/browser-file-access-api/main.ts',
        ),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].[format].js',
      },
    },
  },
});
