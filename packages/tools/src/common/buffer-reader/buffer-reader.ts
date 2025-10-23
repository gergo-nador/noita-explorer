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

  function readFloatBE() {
    const value = buffer.readFloatBE(offset);
    offset += 4;
    return value;
  }
  function readDoubleBE() {
    const value = buffer.readDoubleBE(offset);
    offset += 8;
    return value;
  }

  function readBool() {
    const value = buffer.readUint8(offset);
    offset += 1;
    return Boolean(value);
  }

  function readUint8() {
    const value = buffer.readUint8(offset);
    offset += 1;
    return value;
  }

  function readUint16BE() {
    const value = buffer.readUint16BE(offset);
    offset += 2;
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

  function readInt64BE() {
    let value: bigint;

    if (typeof buffer['readBigInt64BE'] === 'function') {
      value = buffer.readBigInt64BE(offset);
      return value;
    } else {
      const dataView = new DataView(buffer.buffer, offset, 8);
      value = dataView.getBigInt64(0, false);
    }

    offset += 8;
    return value;
  }
  function readUInt64BE() {
    let value: bigint;

    if (typeof buffer['readBigUInt64BE'] === 'function') {
      value = buffer.readBigUInt64BE(offset);
    } else {
      const dataView = new DataView(buffer.buffer, offset, 8);
      value = dataView.getBigUint64(0, false);
    }
    offset += 8;
    return value;
  }

  return {
    getOffset: () => offset,
    getBuffer: () => buffer,
    jumpBytes,
    subarray,
    toString,

    readString,

    readFloatBE,
    readDoubleBE,

    readBool,

    readUint8,

    readUint16BE,

    readInt32BE,
    readInt32LE,
    readUInt32BE,
    readUInt32LE,

    readInt64BE,
    readUInt64BE,
  };
}
