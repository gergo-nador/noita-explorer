type EnvironmentType = 'development' | 'preview' | 'production';

const viteEnv = import.meta.env.VITE_ENV;
export const environment: EnvironmentType =
  viteEnv === 'production'
    ? 'production'
    : viteEnv === 'preview'
      ? 'preview'
      : 'development';
