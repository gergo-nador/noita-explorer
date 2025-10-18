import { Buffer } from 'buffer';

export function readBufferString(
  buffer: Buffer,
  options?: {
    encoding?: BufferEncoding;
  },
): string {
  const length = buffer.readInt32BE(0);
  if (length < 0) throw new Error('String length below zero: ' + length);
  if (length > 10_000_000)
    throw new Error('String length over limit: ' + length);

  const stringBuff = buffer.subarray(4, length + 4);
  return stringBuff.toString(options?.encoding ?? 'utf-8');
}
