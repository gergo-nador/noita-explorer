import { FastLZCompressor } from '@noita-explorer/fastlz';
import { FileSystemFileAccess } from '@noita-explorer/model';
import { uncompressNoitaBuffer } from './uncompress-noita-buffer.ts';

export async function uncompressNoitaFile(
  file: FileSystemFileAccess,
  fastLzCompressor: FastLZCompressor,
) {
  let fileBuffer = await file.read.asBuffer();
  return uncompressNoitaBuffer(fileBuffer, fastLzCompressor);
}
