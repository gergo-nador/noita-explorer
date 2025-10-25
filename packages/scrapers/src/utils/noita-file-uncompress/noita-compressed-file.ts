import { Buffer } from 'buffer';

export interface NoitaCompressedFile {
  compressedDataSize: number;
  uncompressedDataSize: number;
  data: Buffer;
}
