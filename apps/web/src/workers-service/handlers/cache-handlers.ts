import { http } from 'msw';
import { cacheMiddleWare } from '../middlewares/cache-middleware.ts';

export const cacheHandlers = [
  http.get('/noita_wak_data.json', cacheMiddleWare),
];
