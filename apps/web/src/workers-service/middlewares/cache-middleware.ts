import { bypass, DefaultBodyType, HttpResponse, PathParams } from 'msw';
// @ts-expect-error weird import error
import { ResponseResolverInfo } from 'msw/lib/core/handlers/RequestHandler';
// @ts-expect-error weird import error
import { HttpRequestResolverExtras } from 'msw/lib/core/handlers/HttpHandler';

const NOITA_CACHE_PREFIX = 'noita-cache-';
const CURRENT_CACHE_KEY = `${NOITA_CACHE_PREFIX}${__DEPLOY_ID__}`;

// initial cleanup of old cache keys
caches.keys().then(async (cacheNames) => {
  for (const cacheName of cacheNames) {
    if (!cacheName.startsWith(NOITA_CACHE_PREFIX)) continue;

    if (cacheName !== CURRENT_CACHE_KEY) {
      await caches.delete(cacheName);
    }
  }
});

/**
 * Gets the response from the cache. If not stored in cache, it will download the response from internet and store it.
 * @param request
 */
export async function cacheMiddleWare(
  request: ResponseResolverInfo<
    HttpRequestResolverExtras<PathParams>,
    DefaultBodyType
  >,
) {
  const cache = await caches.open(CURRENT_CACHE_KEY);

  const cacheResponse = await cache.match(request.request);
  if (cacheResponse) {
    return new HttpResponse(cacheResponse.body, {
      status: cacheResponse.status,
      statusText: cacheResponse.statusText,
      headers: cacheResponse.headers,
    });
  }

  const realResponse = await fetch(bypass(request.request.clone())).then(
    (response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response;
    },
  );

  await cache.put(request.request, realResponse.clone());

  return new HttpResponse(realResponse.body, {
    status: realResponse.status,
    statusText: realResponse.statusText,
    headers: realResponse.headers,
  });
}
