/// <reference types="vite/client" />

declare const __DEPLOY_ID__: string;
declare const __DEPLOY_TIME__: string;
declare const __ENV__: EnvironmentType;

type EnvironmentType = 'development' | 'preview' | 'production';
