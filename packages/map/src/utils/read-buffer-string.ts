import { BufferReader } from './buffer-reader.ts';

export function readBufferString(
  bufferReader: BufferReader,
  options?: {
    encoding?: BufferEncoding;
  },
): string {
  const length = bufferReader.readInt32BE();
  if (length < 0) throw new Error('String length below zero: ' + length);
  if (length > 10_000_000)
    throw new Error('String length over limit: ' + length);

  const stringBuff = bufferReader.subarray(length);
  const text = stringBuff.toString(options?.encoding ?? 'utf-8');
  bufferReader.jumpBytes(length);

  return text;
}
