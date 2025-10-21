import { Buffer } from 'buffer';

/**
 * Process an item of the array from a buffer.
 *
 * Returns the size of the used array to calculate the offset for the next item.
 */
export type BufferReaderIteratorCallback<T> = (
  buffer: Buffer,
  i: number,
) => { offset: number; item: T };
