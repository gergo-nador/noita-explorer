export interface FileReadOptions {
  asText: () => Promise<string>;
  asTextLines: () => Promise<string[]>;
  asImageBase64: () => Promise<string>;
  asBuffer: () => Promise<ArrayBuffer>;
}
