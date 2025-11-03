import { http } from 'msw';
import { cacheLocalMiddleware } from '../middlewares/cache-local-middleware.ts';
import { cacheDataWakFromBucket } from '../middlewares/cache-data-wak-from-bucket.ts';

export const cacheHandlers = [
  http.get('/noita_wak_data.json', cacheLocalMiddleware),
  http.get(import.meta.env.VITE_DATA_WAK_URL, cacheDataWakFromBucket),
];
