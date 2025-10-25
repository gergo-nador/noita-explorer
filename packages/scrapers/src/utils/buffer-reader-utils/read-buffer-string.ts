import { BufferReader } from '@noita-explorer/tools';

export function readBufferString(
  bufferReader: BufferReader,
  options?: {
    encoding?: BufferEncoding;
  },
): string {
  const length = bufferReader.readInt32BE();

  if (length < 0) throw new Error('String length below zero: ' + length);
  if (length > 10_000) throw new Error('String length over limit: ' + length);

  const text = bufferReader.readString(length, options?.encoding ?? 'utf-8');

  return text;
}
