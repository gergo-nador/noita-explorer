import { NoitaCompressedFile } from './noita-compressed-file.ts';
import { createFastLzCompressor } from '@noita-explorer/fastlz';

const fastLzCompressorPromise = createFastLzCompressor();

export async function uncompressNoitaFile(file: NoitaCompressedFile) {
  const fastLzCompressor = await fastLzCompressorPromise;
  return fastLzCompressor.decompressBuffer(
    file.data,
    file.uncompressedDataSize,
  );
}
