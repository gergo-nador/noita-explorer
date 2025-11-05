import { ImageData } from 'canvas';

export interface CropImageBase64Options {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type PixelColorOptions = Record<string | '_', string>;

export type OverlayBlendMode = 'source_over' | 'additive' | 'overlay';
export interface OverlayOptions {
  blendMode?: OverlayBlendMode;
  /**
   * - `below`: destination image is below source
   * - `over`: destination image is over source (default)
   */
  destinationPosition?: 'below' | 'over';
  opacitySource?: number;
  opacityDestination?: number;
  destinationPlacement?: 'default' | 'center';
}

export interface FlipOptions {
  horizontal: boolean;
  vertical: boolean;
}

export interface MaterialContainerOptions {
  color: string;
  mouthRowStart: number;
  mouthRowEnd: number;
}

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
  overlayImages: (
    background: string,
    overlay: string,
    options?: OverlayOptions,
  ) => Promise<string>;
  flipImage: (base64: string, options?: FlipOptions) => Promise<string>;
  renderMaterialContainer: (
    containerImage: string,
    options: MaterialContainerOptions,
  ) => Promise<string>;
  base64ToImageData: (base64: string) => Promise<ImageData>;
}
