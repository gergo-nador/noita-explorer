import { ImageHelpersType } from './images.types.ts';

function trimWhitespaceBase64() {}
function scaleImageBase64() {}
function rotateImageBase64() {}
function getAverageColorBase64() {}
function getImageSizeBase64() {}

function cropImageBase64() {
  console.log('node js implementation');
}

export const imageHelpers: ImageHelpersType = {
  // @ts-expect-error viajnvo aesfo amfv
  trimWhitespaceBase64,
  // @ts-expect-error viajnvo aesfo amfv
  scaleImageBase64,
  // @ts-expect-error viajnvo aesfo amfv
  rotateImageBase64,
  // @ts-expect-error viajnvo aesfo amfv
  getAverageColorBase64,
  // @ts-expect-error viajnvo aesfo amfv
  getImageSizeBase64,
  // @ts-expect-error viajnvo aesfo amfv
  cropImageBase64,
};
