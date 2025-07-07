import { ImageHelpersType } from './images.types.ts';
import { Jimp } from 'jimp';
import { base64Helpers } from './base64.ts';

function trimWhitespaceBase64() {}
function scaleImageBase64() {}
function rotateImageBase64() {}
function getAverageColorBase64() {}

async function getImageSizeBase64(base64: string) {
  base64 = base64Helpers.trimMetadata(base64);
  const inputBuffer = Buffer.from(base64, 'base64');
  const image = await Jimp.read(inputBuffer);

  return { height: image.height, width: image.width };
}

async function cropImageBase64(
  base64: string,
  options: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
) {
  base64 = base64Helpers.trimMetadata(base64);
  const inputBuffer = Buffer.from(base64, 'base64');
  const image = await Jimp.read(inputBuffer);

  image.crop({
    x: options.x,
    y: options.y,
    w: options.width,
    h: options.height,
  });

  const outputBuffer = await image.getBuffer('image/png');
  const outputBase64 = outputBuffer.toString('base64');

  return base64Helpers.appendMetadata(outputBase64);
}

export const imageHelpers: ImageHelpersType = {
  // @ts-expect-error not needed (yet)
  trimWhitespaceBase64,
  // @ts-expect-error not needed (yet)
  scaleImageBase64,
  // @ts-expect-error not needed (yet)
  rotateImageBase64,
  // @ts-expect-error not needed (yet)
  getAverageColorBase64,
  getImageSizeBase64,
  cropImageBase64,
};
