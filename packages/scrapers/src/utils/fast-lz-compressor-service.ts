import { createFastLzCompressor } from '@noita-explorer/fastlz';

export const fastLzCompressorService = (() => {
  const compressorPromise = createFastLzCompressor();

  return { get: () => compressorPromise };
})();
