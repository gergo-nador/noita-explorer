import { BufferReader } from './buffer-reader.types.ts';

/**
 * Process an item of the array from a buffer.
 *
 * Returns the size of the used array to calculate the offset for the next item.
 */
export type BufferReaderIteratorCallback<T> = (
  bufferReader: BufferReader,
  i: number,
) => T;
