export interface FileSystemFileAccess {
  getName: () => string;
  getNameWithoutExtension: () => string;
  read: {
    asText: () => Promise<string>;
    asTextLines: () => Promise<string[]>;
    asImageBase64: () => Promise<string>;
    asBuffer: () => Promise<Buffer>;
  };
}
