type EnvironmentType = 'development' | 'preview' | 'production';

const viteEnv = import.meta.env.VITE_ENV;
export const environment: EnvironmentType =
  viteEnv === 'production'
    ? 'production'
    : viteEnv === 'preview'
      ? 'preview'
      : 'development';

export const deployUrls = {
  noitaExplorer: {
    production: 'https://www.noita-explorer.com',
    preview: 'https://dev.noita-explorer.com',
  },
  cloudflare: {
    production: 'https://noita-explorer.pages.dev/',
    preview: 'https://dev.noita-explorer.pages.dev/',
  },
  development: 'https://localhost:4000',
};
