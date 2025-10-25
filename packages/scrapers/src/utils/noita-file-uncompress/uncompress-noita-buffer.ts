import { Buffer } from 'buffer';
import { createBufferReader } from '@noita-explorer/tools';
import { fastLzCompressorService } from '../fast-lz-compressor-service.ts';
import { NoitaCompressedFile } from './noita-compressed-file.ts';

export async function uncompressNoitaBuffer(buffer: Buffer) {
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

  const fastLzCompressor = await fastLzCompressorService.get();

  return fastLzCompressor.decompressBuffer(
    compressedFile.data,
    compressedFile.uncompressedDataSize,
  );
}
