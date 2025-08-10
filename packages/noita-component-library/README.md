# Noita Component Library

## Usage

Assets used in this library needs to be copied over to the `public/noita-component-library` folder.

Example:
```ts
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: '../../node_modules/@noita-explorer/noita-component-library/assets/*',
            dest: 'noita-component-library',
          },
        ],
      }),
    ]
```