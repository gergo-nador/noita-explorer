import { FastLZCompressor } from '@noita-explorer/fastlz';
import { Buffer } from 'buffer';
import { NoitaCompressedFile } from '../interfaces/noita-compressed-file.ts';
import { createBufferReader } from '@noita-explorer/tools';

export async function uncompressNoitaBuffer(
  buffer: Buffer,
  fastLzCompressor: FastLZCompressor,
) {
  // ensure file buffer is an actual buffer
  if (!Buffer.isBuffer(buffer)) {
    buffer = Buffer.from(buffer);
  }

  const bufferReader = createBufferReader(buffer);

  const compressedFile: NoitaCompressedFile = {
    compressedDataSize: bufferReader.readInt32LE(),
    uncompressedDataSize: bufferReader.readInt32LE(),
    data: bufferReader.subarray().getBuffer(),
  };

  // if the compressed and uncompressed size is the same, the file is not compressed
  if (
    compressedFile.compressedDataSize === compressedFile.uncompressedDataSize
  ) {
    return compressedFile.data;
  }

  return fastLzCompressor.decompressBuffer(
    compressedFile.data,
    compressedFile.uncompressedDataSize,
  );
}
