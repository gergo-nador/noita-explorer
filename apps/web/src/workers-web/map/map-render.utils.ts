import { WebTransferable } from '@noita-explorer/model';
import { Buffer } from 'buffer';

export async function convertWebTransferableToBuffer(
  webTransferable: WebTransferable,
): Promise<Buffer> {
  if (webTransferable instanceof FileSystemFileHandle) {
    const file = await webTransferable.getFile();
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } else {
    return Buffer.from(webTransferable);
  }
}
