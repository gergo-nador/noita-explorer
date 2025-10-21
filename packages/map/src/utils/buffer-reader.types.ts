import { Buffer } from 'buffer';
import { ReturnFunction } from '@noita-explorer/model';

export interface BufferReader {
  jumpBytes: (bytes: number) => void;
  subarray: (start?: number, end?: number) => BufferReader;
  getOffset: () => number;
  toString: Buffer['toString'];

  readString: (length: number, encoding?: BufferEncoding) => string;
  readInt32BE: ReturnFunction<number>;
  readInt32LE: ReturnFunction<number>;
  readUInt32BE: ReturnFunction<number>;
  readUInt32LE: ReturnFunction<number>;
  readFloatBE: ReturnFunction<number>;
  readUint8: ReturnFunction<number>;
}
