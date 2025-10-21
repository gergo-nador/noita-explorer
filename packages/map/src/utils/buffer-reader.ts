import { Buffer } from 'buffer';
import { BufferReader } from './buffer-reader.types.ts';

export function createBufferReader(buffer: Buffer): BufferReader {
  let offset = 0;

  function jumpBytes(bytes: number) {
    offset += bytes;
  }

  function subarray(length?: number) {
    const end = length !== undefined ? offset + length : undefined;
    const subBuffer = buffer.subarray(offset, end);
    return createBufferReader(subBuffer);
  }

  function toString(
    ...args: Parameters<Buffer['toString']>
  ): ReturnType<Buffer['toString']> {
    return buffer.toString(...args);
  }

  function readString(length: number, encoding?: BufferEncoding) {
    const value = buffer.toString(encoding, offset, offset + length);
    offset += length;
    return value;
  }

  function readInt32BE() {
    const value = buffer.readInt32BE(offset);
    offset += 4;
    return value;
  }

  function readInt32LE() {
    const value = buffer.readInt32LE(offset);
    offset += 4;
    return value;
  }

  function readUInt32BE() {
    const value = buffer.readUInt32BE(offset);
    offset += 4;
    return value;
  }

  function readUInt32LE() {
    const value = buffer.readUInt32LE(offset);
    offset += 4;
    return value;
  }

  function readFloatBE() {
    const value = buffer.readFloatBE(offset);
    offset += 4;
    return value;
  }

  function readUint8() {
    const value = buffer.readUint8(offset);
    offset += 1;
    return value;
  }

  return {
    getOffset: () => offset,
    jumpBytes,
    subarray,
    toString,
    readString,
    readInt32BE,
    readInt32LE,
    readUInt32BE,
    readUInt32LE,
    readFloatBE,
    readUint8,
  };
}
