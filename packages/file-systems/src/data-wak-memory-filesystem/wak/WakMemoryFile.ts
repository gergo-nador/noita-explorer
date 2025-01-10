import { Buffer } from 'buffer';

export interface WakMemoryFile {
  path: string;
  getFileBytes: () => Buffer;
}
