import { FileSystemFileAccess, WebTransferable } from '@noita-explorer/model';
import { Transfer } from '../map-renderer-threads/threads-pool.types.ts';

export async function convertFileToWebTransferable(
  file: FileSystemFileAccess,
): Promise<WebTransferable> {
  const transferable = file.supportsTransferable();
  if (transferable) {
    return transferable;
  }

  // fallback: read file as buffer
  const array = await file.read.asBuffer();
  return Transfer(array.buffer);
}
