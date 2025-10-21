import { NoitaCompressedFile } from '../interfaces/noita-compressed-file.ts';
import { Buffer } from 'buffer';
import { FastLZCompressor } from '@noita-explorer/fastlz';
import { FileSystemFileAccess } from '@noita-explorer/model';

export async function uncompressNoitaFile(
  file: FileSystemFileAccess,
  fastLzCompressor: FastLZCompressor,
) {
  let fileBuffer = await file.read.asBuffer();
  // ensure file buffer is an actual buffer
  if (!Buffer.isBuffer(fileBuffer)) {
    fileBuffer = Buffer.from(fileBuffer);
  }

  const compressedFile: NoitaCompressedFile = {
    compressedDataSize: fileBuffer.readInt32LE(0),
    uncompressedDataSize: fileBuffer.readInt32LE(4),
    data: fileBuffer.subarray(8),
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
