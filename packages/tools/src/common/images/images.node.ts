import {
  CropImageBase64Options,
  FlipOptions,
  ImageHelpersType,
  OverlayBlendMode,
  OverlayOptions,
  PixelColorOptions,
} from './images.types.ts';
import { BlendMode, Jimp, JimpMime } from 'jimp';
import { base64Helpers } from '../base64.ts';
import { colorHelpers } from '../color-util.ts';
import { throwHelpers } from '../throw.ts';

function trimWhitespaceBase64(): Promise<string> {
  return throwHelpers.notImplementedInCurrentEnvironment(trimWhitespaceBase64);
}
function scaleImageBase64(): Promise<string> {
  return throwHelpers.notImplementedInCurrentEnvironment(scaleImageBase64);
}
function rotateImageBase64(): Promise<string> {
  return throwHelpers.notImplementedInCurrentEnvironment(rotateImageBase64);
}
function getAverageColorBase64(): Promise<string> {
  return throwHelpers.notImplementedInCurrentEnvironment(getAverageColorBase64);
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
  overlay: BlendMode.OVERLAY,
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

  const x =
    options?.destinationPlacement === 'center'
      ? (background.width - overlay.width) / 2
      : 0;
  const y =
    options?.destinationPlacement === 'center'
      ? (background.height - overlay.height) / 2
      : 0;

  if (options?.destinationPosition === 'below') {
    const image = new Jimp({
      width: background.width,
      height: background.height,
      color: 0x00000000,
    });
    image.composite(overlay, x, y);
    image.composite(background, 0, 0, { mode: blendMode, opacitySource: 1.0 });
    return await jimpToBase64(image);
  }

  background.composite(overlay, x, y, {
    mode: blendMode,
    opacitySource: 1.0,
  });

  return await jimpToBase64(background);
}

async function flipImage(imageBase64: string, options?: FlipOptions) {
  const image = await getJimpImage(imageBase64);

  image.flip({ horizontal: options?.horizontal, vertical: options?.vertical });

  return await jimpToBase64(image);
}

function renderMaterialContainer(): Promise<string> {
  return throwHelpers.notImplementedInCurrentEnvironment(
    renderMaterialContainer,
  );
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
  flipImage,
  renderMaterialContainer,
};
