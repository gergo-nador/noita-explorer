export interface CropImageBase64Options {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type PixelColorOptions = Record<string | '_', string>;

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
    options: CropImageBase64Options,
  ) => Promise<string>;
  pixelRecolor: (base64: string, map: PixelColorOptions) => Promise<string>;
  overlayImages: (background: string, overlay: string) => Promise<string>;
}
