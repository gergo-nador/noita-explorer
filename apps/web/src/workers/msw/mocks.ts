import { setupWorker } from 'msw/browser';
import { dataWakHandlers } from './handlers/data-wak-handlers.ts';

export const worker = setupWorker(...dataWakHandlers);
