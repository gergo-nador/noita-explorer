import { FileSystemFileAccess } from '@noita-explorer/model';
import { uncompressNoitaBuffer } from './uncompress-noita-buffer.ts';

export async function uncompressNoitaFile(file: FileSystemFileAccess) {
  const fileBuffer = await file.read.asBuffer();
  return uncompressNoitaBuffer(fileBuffer);
}
