import { setupWorker } from 'msw/browser';
import { dataWakHandlers } from './handlers/data-wak-handlers.ts';
import { cacheHandlers } from './handlers/cache-handlers.ts';

export const worker = setupWorker(...[...dataWakHandlers, ...cacheHandlers]);
