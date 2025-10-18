import { Buffer } from 'buffer';

export function readBufferArray(
  buffer: Buffer,
  options?: {
    // Defaults to `big`
    endian?: 'little' | 'big';
    length?: number;
  },
) {
  let baseOffset = 0;
  const endian = options?.endian ?? 'big';
  let length = options?.length;

  // if the length is unknown, it's going to be the first int
  if (length === undefined) {
    length =
      endian === 'little' ? buffer.readInt32LE(0) : buffer.readInt32BE(0);
    baseOffset = 4;
  }

  return {
    iterate: <T>(callback: BufferReaderIteratorCallback<T>) => {
      // items count
      let offset = baseOffset;
      const items: T[] = [];

      for (let i = 0; i < length; i++) {
        const itemBuffer = buffer.subarray(offset);
        const output = callback(itemBuffer, i);
        offset += output.offset;
        items.push(output.item);
      }

      return { items, offset };
    },
  };
}

/**
 * Process an item of the array from a buffer.
 *
 * Returns the size of the used array to calculate the offset for the next item.
 */
type BufferReaderIteratorCallback<T> = (
  buffer: Buffer,
  i: number,
) => { offset: number; item: T };
