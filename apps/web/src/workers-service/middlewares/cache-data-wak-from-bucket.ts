// @ts-expect-error weird import error
import { ResponseResolverInfo } from 'msw/lib/core/handlers/RequestHandler';
// @ts-expect-error weird import error
import { HttpRequestResolverExtras } from 'msw/lib/core/handlers/HttpHandler';
import { DefaultBodyType, HttpResponse, PathParams, bypass } from 'msw';

const NOITA_DATA_WAK_CACHE_KEY = 'data-wak-cache';

/**
 * Custom caching for the data.wak file.
 * If the Last-Modified header is not set by the server, the data.wak file cannot be cached!!!
 * @param request
 */
export async function cacheDataWakFromBucket(
  request: ResponseResolverInfo<
    HttpRequestResolverExtras<PathParams>,
    DefaultBodyType
  >,
) {
  const cache = await caches.open(NOITA_DATA_WAK_CACHE_KEY);

  // get the previous cached response if exists
  const cachedResponse = await cache.match(request.request);

  let lastModified: string | null = null;

  // if response exists, check for it's Last-Modified header
  if (cachedResponse) {
    lastModified = cachedResponse.headers.get('Last-Modified');
  }

  const serverRequest = request.request.clone();

  // append the 'If-Modified-Since' header to see if there is a new version of the data.wak file
  if (lastModified) {
    serverRequest.headers.set('If-Modified-Since', lastModified);
  }

  let serverResponse: Response;
  try {
    serverResponse = await fetch(bypass(serverRequest));
  } catch {
    return HttpResponse.error();
  }

  const isNotModified = serverResponse.status === 304;
  if (isNotModified && cachedResponse) {
    serverResponse.body?.cancel();

    return new HttpResponse(cachedResponse.body, {
      status: 200,
      headers: {
        'X-MSW-Cache': 'HIT',
        ...cachedResponse.headers,
      },
    });
  }

  // remove old cache if exist
  if (cachedResponse) {
    await cache.delete(request);
  }

  if (serverResponse.status === 200) {
    const clonedResponse = serverResponse.clone();

    void cache.put(serverRequest, clonedResponse);

    return new HttpResponse(serverResponse.body, {
      status: 200,
      headers: serverRequest.headers,
    });
  }

  return serverResponse;
}
