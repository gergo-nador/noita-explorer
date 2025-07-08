import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ include: ['src'] })],
  build: {
    lib: {
      entry: {
        main: resolve(__dirname, 'src/main.ts'),
        lua: resolve(__dirname, 'src/lua/main.ts'),
        xml: resolve(__dirname, 'src/xml/main.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].[format].js',
        globals: {
          jimp: 'jimp',
          omggif: 'omggif',
          canvas: 'canvas',
        },
      },
      external: ['jimp', 'omggif', 'canvas'],
    },
  },
});
