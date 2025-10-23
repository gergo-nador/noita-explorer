import { Buffer } from 'buffer';
import { ReturnFunction } from '@noita-explorer/model';

export interface BufferReader {
  jumpBytes: (bytes: number) => void;
  subarray: (start?: number, end?: number) => BufferReader;
  getOffset: () => number;
  toString: Buffer['toString'];
  getBuffer: () => Buffer;

  readString: (length: number, encoding?: BufferEncoding) => string;

  // floating point
  readFloatBE: ReturnFunction<number>;
  readDoubleBE: ReturnFunction<number>;

  // bool
  readBool: ReturnFunction<boolean>;

  // int 8
  readUint8: ReturnFunction<number>;

  // int 16
  readUint16BE: ReturnFunction<number>;

  // int 32
  readInt32BE: ReturnFunction<number>;
  readInt32LE: ReturnFunction<number>;
  readUInt32BE: ReturnFunction<number>;
  readUInt32LE: ReturnFunction<number>;

  // int64
  readInt64BE: ReturnFunction<bigint>;
  readUInt64BE: ReturnFunction<bigint>;
}
