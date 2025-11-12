import { WebTransferable } from './web-transferable.ts';

export interface FileSystemFileAccess {
  getFullPath: () => string;
  getName: () => string;
  getNameWithoutExtension: () => string;
  supportsTransferable: () => WebTransferable | undefined;
  read: {
    asText: () => Promise<string>;
    asTextLines: () => Promise<string[]>;
    asImageBase64: () => Promise<string>;
    asBuffer: () => Promise<Buffer>;
  };
  delete: () => Promise<void>;
  modify: {
    fromText: (text: string) => Promise<void>;
    fromBuffer: (buffer: Buffer) => Promise<void>;
  };
}
