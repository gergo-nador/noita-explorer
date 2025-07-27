import {
  CropImageBase64Options,
  ImageHelpersType,
  OverlayBlendMode,
  OverlayOptions,
  PixelColorOptions,
} from './images.types.ts';
import { Jimp, BlendMode, JimpMime } from 'jimp';
import { base64Helpers } from '../base64.ts';
import { colorHelpers } from '../color-util.ts';

function trimWhitespaceBase64(): Promise<string> {
  throw new Error(
    'trimWhitespaceBase64 is not implemented for node.js environment',
  );
}
function scaleImageBase64(): Promise<string> {
  throw new Error(
    'scaleImageBase64 is not implemented for node.js environment',
  );
}
function rotateImageBase64(): Promise<string> {
  throw new Error(
    'rotateImageBase64 is not implemented for node.js environment',
  );
}
function getAverageColorBase64(): Promise<string> {
  throw new Error(
    'getAverageColorBase64 is not implemented for node.js environment',
  );
}

async function getJimpImage(base64: string) {
  const trimmedBase64 = base64Helpers.trimMetadata(base64);
  const inputBuffer = Buffer.from(trimmedBase64, 'base64');
  return await Jimp.read(inputBuffer);
}

async function jimpToBase64(image: {
  getBuffer: (mime: 'image/png') => Promise<Buffer>;
}) {
  const outputBuffer = await image.getBuffer(JimpMime.png);
  const outputBase64 = outputBuffer.toString('base64');

  return base64Helpers.appendMetadata(outputBase64);
}

async function getImageSizeBase64(base64: string) {
  const image = await getJimpImage(base64);
  return { height: image.height, width: image.width };
}

async function cropImageBase64(
  base64: string,
  options: CropImageBase64Options,
): Promise<string> {
  const image = await getJimpImage(base64);

  image.crop({
    x: options.x,
    y: options.y,
    w: options.width,
    h: options.height,
  });

  return await jimpToBase64(image);
}

async function pixelRecolor(
  base64: string,
  map: PixelColorOptions,
): Promise<string> {
  const image = await getJimpImage(base64);

  const convertedColors = Object.entries(map)
    .filter(([key]) => key !== '_')
    .map(([key, value]) => {
      const keyColor = colorHelpers.conversion.rgbaToNumber(key);
      const valueColor = colorHelpers.conversion.rgbaToNumber(value);

      return [keyColor, valueColor] as [number, number];
    });
  const colorMap = Object.fromEntries(convertedColors);

  const defaultColor =
    '_' in map ? colorHelpers.conversion.rgbaToNumber(map['_']) : undefined;

  image.scan(function (x, y) {
    const color = image.getPixelColor(x, y);
    if (colorMap[color] !== undefined) {
      const newColor = colorMap[color];
      image.setPixelColor(newColor, x, y);
    } else if (defaultColor !== undefined) {
      image.setPixelColor(defaultColor, x, y);
    }
  });

  return await jimpToBase64(image);
}

const overlayBlendModeMap = {
  additive: BlendMode.ADD,
  source_over: BlendMode.SRC_OVER,
} satisfies Record<OverlayBlendMode, BlendMode>;

async function overlayImages(
  backgroundBase64: string,
  overlayBase64: string,
  options?: OverlayOptions,
) {
  const background = await getJimpImage(backgroundBase64);
  const overlay = await getJimpImage(overlayBase64);

  const blendMode =
    overlayBlendModeMap[options?.blendMode ?? 'source_over'] ??
    BlendMode.SRC_OVER;

  background.composite(overlay, 0, 0, {
    mode: blendMode,
    opacitySource: 1.0,
  });

  return await jimpToBase64(background);
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
