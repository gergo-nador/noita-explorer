export interface FileReadOptions {
  asText: () => Promise<string>;
  asImageBase64: () => Promise<string>;
  asBuffer: () => Promise<ArrayBuffer>;
}
