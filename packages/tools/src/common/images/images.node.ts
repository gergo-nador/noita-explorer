import {
  CropImageBase64Options,
  FlipOptions,
  ImageHelpersType,
  MaterialContainerOptions,
  OverlayBlendMode,
  OverlayOptions,
  PixelColorOptions,
} from './images.types.ts';
import { BlendMode, Jimp, JimpMime } from 'jimp';
import Color from 'color';
import { base64Helpers } from '../base64.ts';
import { colorHelpers } from '../color-util.ts';
import { throwHelpers } from '../throw.ts';
import { ImageData } from 'canvas';

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

export async function renderMaterialContainer(
  containerImage: string,
  options: MaterialContainerOptions,
): Promise<string> {
  // parse color
  const [r, g, b] = Color(options.color).rgb().array();

  const potionColorMain = {
    r: r / 255,
    g: g / 255,
    b: b / 255,
    a: 1,
  };

  const potionFilter = {
    r: 0.85,
    g: 0.85,
    b: 0.85,
    a: 1,
  };

  const image = await getJimpImage(containerImage);

  // ensure the bitmap is RGBA (Jimp uses RGBA)
  const { width, height, data } = image.bitmap; // data is a Buffer of length width*height*4

  // per-pixel manipulation
  for (let y = 0; y < height; y++) {
    const isPotionMouthRow =
      y >= options.mouthRowStart && y <= options.mouthRowEnd;

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4; // R, G, B, A

      // read original channels (0..255)
      let nr = data[idx];
      let ng = data[idx + 1];
      let nb = data[idx + 2];
      let na = data[idx + 3];

      // apply potionFilter first
      nr = nr * potionFilter.r;
      ng = ng * potionFilter.g;
      nb = nb * potionFilter.b;
      na = na * potionFilter.a;

      // if not mouth row, additionally multiply by potionColorMain
      if (!isPotionMouthRow) {
        nr = nr * potionColorMain.r;
        ng = ng * potionColorMain.g;
        nb = nb * potionColorMain.b;
        na = na * potionColorMain.a;
      }

      // write back (clamp 0..255)
      data[idx] = clamp(Math.round(nr));
      data[idx + 1] = clamp(Math.round(ng));
      data[idx + 2] = clamp(Math.round(nb));
      data[idx + 3] = clamp(Math.round(na));
    }
  }

  // Jimp mutates image.bitmap.data in place, so now export to PNG buffer
  return await jimpToBase64(image);
}

function clamp(v: number) {
  return Math.max(0, Math.min(255, v));
}

async function base64ToImageData(base64: string): Promise<ImageData> {
  const image = await getJimpImage(base64);

  const { width, height, data } = image.bitmap;
  const clamped = new Uint8ClampedArray(data.buffer);
  const imageData = new ImageData(clamped, width, height);

  return imageData;
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
  base64ToImageData,
};
