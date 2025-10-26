import { setupWorker } from 'msw/browser';
import { dataWakHandlers } from './data-wak-handlers.ts';

export const worker = setupWorker(...dataWakHandlers);
