export interface FileSystemFileAccess {
  getFullPath: () => string;
  getName: () => string;
  getNameWithoutExtension: () => string;
  read: {
    asText: () => Promise<string>;
    asTextLines: () => Promise<string[]>;
    asImageBase64: () => Promise<string>;
    asBuffer: () => Promise<Buffer>;
  };
  delete: () => Promise<void>;
}
