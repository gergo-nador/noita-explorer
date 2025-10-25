import {
  BufferReader,
  BufferReaderIteratorCallback,
} from '@noita-explorer/tools';

export function readBufferArray(
  bufferReader: BufferReader,
  options?: {
    // Defaults to `big`
    endian?: 'little' | 'big';
    length?: number;
  },
) {
  const endian = options?.endian ?? 'big';
  let length = options?.length;

  // if the length is unknown, it's going to be the first int
  if (length === undefined) {
    length =
      endian === 'little'
        ? bufferReader.readInt32LE()
        : bufferReader.readInt32BE();
  }

  return {
    iterate: <T>(callback: BufferReaderIteratorCallback<T>) => {
      // items count
      const items: T[] = [];

      for (let i = 0; i < length; i++) {
        const output = callback(bufferReader, i);
        items.push(output);
      }

      return { items };
    },
  };
}
