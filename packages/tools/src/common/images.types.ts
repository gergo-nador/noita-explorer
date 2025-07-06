export interface ImageHelpersType {
  trimWhitespaceBase64: (base64: string) => Promise<string>;
  scaleImageBase64: (base64: string, scaleFactor: number) => Promise<string>;
  rotateImageBase64: (base64: string, degrees: number) => Promise<string>;
  getAverageColorBase64: (base64: string) => Promise<string>;
  getImageSizeBase64: (
    base64: string,
  ) => Promise<{ width: number; height: number }>;
  cropImageBase64: (
    base64: string,
    options: {
      x: number;
      y: number;
      width: number;
      height: number;
    },
  ) => Promise<string>;
}
