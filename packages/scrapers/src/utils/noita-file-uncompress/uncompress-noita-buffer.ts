import { Buffer } from 'buffer';
import { createBufferReader } from '@noita-explorer/tools';
import { NoitaCompressedFile } from './noita-compressed-file.ts';
import { FastLZCompressor } from '@noita-explorer/fastlz';

export async function uncompressNoitaBuffer(
  data: Buffer | ArrayBuffer | Uint8Array,
  fastLzCompressor: FastLZCompressor,
) {
  // ensure file buffer is an actual buffer
  if (data instanceof ArrayBuffer) {
    data = new Uint8Array(data);
  }

  const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);

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
