import { runtimeEnvironment } from '../runtime-environment.ts';
import {
  CropImageBase64Options,
  ImageHelpersType,
  OverlayOptions,
  PixelColorOptions,
} from './images.types.ts';

async function getImageHelper() {
  const importStatement = await runtimeEnvironment.pick({
    node: () => import('./images.node.ts'),
    browser: () => import('./images.browser.ts'),
  });
  return importStatement.imageHelpers;
}

async function trimWhitespaceBase64(base64: string): Promise<string> {
  const imageHelper = await getImageHelper();
  return imageHelper.trimWhitespaceBase64(base64);
}

async function scaleImageBase64(
  base64: string,
  scaleFactor: number,
): Promise<string> {
  const imageHelper = await getImageHelper();
  return imageHelper.scaleImageBase64(base64, scaleFactor);
}

async function rotateImageBase64(
  base64: string,
  degrees: number,
): Promise<string> {
  const imageHelper = await getImageHelper();
  return imageHelper.rotateImageBase64(base64, degrees);
}

async function getAverageColorBase64(base64: string): Promise<string> {
  const imageHelper = await getImageHelper();
  return imageHelper.getAverageColorBase64(base64);
}

async function getImageSizeBase64(
  base64: string,
): Promise<{ width: number; height: number }> {
  const imageHelper = await getImageHelper();
  return imageHelper.getImageSizeBase64(base64);
}

async function cropImageBase64(
  base64: string,
  options: CropImageBase64Options,
) {
  const imageHelper = await getImageHelper();
  return imageHelper.cropImageBase64(base64, options);
}

async function pixelRecolor(base64: string, options: PixelColorOptions) {
  const imageHelper = await getImageHelper();
  return imageHelper.pixelRecolor(base64, options);
}

async function overlayImages(
  background: string,
  overlay: string,
  options?: OverlayOptions,
) {
  const imageHelper = await getImageHelper();
  return imageHelper.overlayImages(background, overlay, options);
}

export const imageHelpers: ImageHelpersType = {
  trimWhitespaceBase64,
  scaleImageBase64,
  rotateImageBase64,
  getAverageColorBase64,
  getImageSizeBase64,
  cropImageBase64,
  pixelRecolor,
  overlayImages,
};
