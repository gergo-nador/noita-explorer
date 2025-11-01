/// <reference types="vite/client" />

declare const __DEPLOY_ID__: string;
declare const __DEPLOY_TIME__: string;
declare const __ENV__: EnvironmentType;
declare const __SSG__: boolean;

type EnvironmentType = 'development' | 'preview' | 'production';

declare module '*?worker' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}
