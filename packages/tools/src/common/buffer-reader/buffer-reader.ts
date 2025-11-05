import { Buffer } from 'buffer';
import { BufferReader } from './buffer-reader.types.ts';
import { ImagePngDimension } from '@noita-explorer/model';

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

  function readPngHeader(): ImagePngDimension {
    const magicNumbers1 = buffer.readUint32BE(0);
    const magicNumbers2 = buffer.readUint32BE(4);

    const PNG_MAGIC_NUMBER_1 = 0x89504e47;
    const PNG_MAGIC_NUMBER_2 = 0x0d0a1a0a;

    if (
      magicNumbers1 !== PNG_MAGIC_NUMBER_1 ||
      magicNumbers2 !== PNG_MAGIC_NUMBER_2
    ) {
      throw new Error('Invalid PNG header bytes');
    }

    const width = buffer.readInt32BE(16);
    const height = buffer.readInt32BE(20);

    return {
      width,
      height,
    };
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

  function readInt16BE() {
    const value = buffer.readInt16BE(offset);
    offset += 2;
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
    readPngHeader,

    readFloatBE,
    readDoubleBE,

    readBool,

    readUint8,

    readInt16BE,
    readUint16BE,

    readInt32BE,
    readInt32LE,
    readUInt32BE,
    readUInt32LE,

    readInt64BE,
    readUInt64BE,
  };
}
