import { Buffer } from 'buffer';

export function readBufferString(
  buffer: Buffer,
  options?: {
    encoding?: BufferEncoding;
  },
): { text: string; offset: number } {
  const length = buffer.readInt32BE(0);
  if (length < 0) throw new Error('String length below zero: ' + length);
  if (length > 10_000_000)
    throw new Error('String length over limit: ' + length);

  const stringBuff = buffer.subarray(4, length + 4);
  const text = stringBuff.toString(options?.encoding ?? 'utf-8');

  return { text, offset: text.length + 4 };
}
