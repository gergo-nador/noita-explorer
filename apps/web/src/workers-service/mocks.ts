import { setupWorker } from 'msw/browser';
import { cacheHandlers } from './handlers/cache-handlers.ts';

export const worker = setupWorker(...[...cacheHandlers]);
