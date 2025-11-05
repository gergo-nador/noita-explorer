import {
  createFastLzCompressor,
  FastLZCompressor,
} from '@noita-explorer/fastlz';

export const fastLzCompressorService = (() => {
  const compressorPromise = !__SSG__ && createFastLzCompressor();

  return {
    get: () => compressorPromise as unknown as Promise<FastLZCompressor>,
  };
})();
