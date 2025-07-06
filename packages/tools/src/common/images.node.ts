import { ImageHelpersType } from './images.types.ts';
import { Jimp } from 'jimp';

function trimWhitespaceBase64() {}
function scaleImageBase64() {}
function rotateImageBase64() {}
function getAverageColorBase64() {}
function getImageSizeBase64() {}

async function cropImageBase64(
  base64: string,
  options: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
) {
  const split = base64.split(';base64,');
  base64 = split.length > 1 ? split[split.length - 1] : base64;
  const inputBuffer = Buffer.from(base64, 'base64');
  const image = await Jimp.read(inputBuffer);

  image.crop({
    x: options.x,
    y: options.y,
    w: options.width,
    h: options.height,
  });

  const outputBuffer = await image.getBuffer('image/png');
  const outputBase64 =
    'data:image/png;base64,' + outputBuffer.toString('base64');

  return outputBase64;
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
  cropImageBase64,
};
