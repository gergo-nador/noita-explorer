import { FileSystemFileAccess } from '@noita-explorer/model';
import { uncompressNoitaBuffer } from './uncompress-noita-buffer.ts';
import { FastLZCompressor } from '@noita-explorer/fastlz';

export async function uncompressNoitaFile(
  file: FileSystemFileAccess,
  fastLzCompressor: FastLZCompressor,
) {
  const fileBuffer = await file.read.asBuffer();
  return uncompressNoitaBuffer(fileBuffer, fastLzCompressor);
}
