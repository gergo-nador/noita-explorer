import { NoitaCompressedFile } from '../interfaces/noita-compressed-file.ts';
import { createFastLzCompressor } from '@noita-explorer/fastlz';
import { Buffer } from 'buffer';
import { FileSystemFileAccess } from '@noita-explorer/model';

const fastLzCompressorPromise = createFastLzCompressor();

export async function uncompressNoitaFile(file: FileSystemFileAccess) {
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

  const fastLzCompressor = await fastLzCompressorPromise;
  return fastLzCompressor.decompressBuffer(
    compressedFile.data,
    compressedFile.uncompressedDataSize,
  );
}
