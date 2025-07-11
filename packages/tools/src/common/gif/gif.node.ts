import { CreateGifOptionsType, GifHelpersType } from './gif.types.ts';
import { GifWriter } from 'omggif';
import { createCanvas, ImageData, loadImage } from 'canvas';

function quantizeColors(imageData: ImageData, maxColors = 256) {
  // this might need some optimization, this code is copied from the proof of concept file
  const pixels = imageData.data;
  const colorMap = new Map();
  const palette = [];

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    if (a < 128) {
      const key = 'transparent';
      if (!colorMap.has(key)) {
        colorMap.set(key, palette.length);
        palette.push(0x000000);
      }
    } else {
      const key = `${r},${g},${b}`;
      if (!colorMap.has(key)) {
        if (palette.length < maxColors) {
          colorMap.set(key, palette.length);
          const color = (r << 16) | (g << 8) | b;
          palette.push(color);
        }
      }
    }
  }

  // Ensure we have at least 2 colors (minimum for GIF)
  while (palette.length < 2) {
    palette.push(0);
  }

  // Pad palette to next power of 2 (2, 4, 8, 16, 32, 64, 128, 256)
  const paletteSize = Math.pow(2, Math.ceil(Math.log2(palette.length)));
  while (palette.length < paletteSize) {
    palette.push(0);
  }

  const indexedData = new Uint8Array(imageData.width * imageData.height);
  for (let i = 0, j = 0; i < pixels.length; i += 4, j++) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    if (a < 128) {
      indexedData[j] = colorMap.get('transparent') || 0;
    } else {
      const key = `${r},${g},${b}`;
      indexedData[j] = colorMap.get(key) || 0;
    }
  }

  return {
    indexedData: [...indexedData],
    palette: palette,
    transparentIndex: colorMap.has('transparent')
      ? colorMap.get('transparent')
      : null,
  };
}

async function createGif({
  frames,
  delayMs,
  repeat,
  width,
  height,
}: CreateGifOptionsType) {
  const buf: number[] = [];
  const gif = new GifWriter(buf, width, height, {
    loop: repeat,
  });

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d', { alpha: true });

  for (const base64 of frames) {
    const img = await loadImage(base64);

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);

    const { indexedData, palette, transparentIndex } =
      quantizeColors(imageData);

    gif.addFrame(0, 0, width, height, indexedData, {
      palette,
      delay: Math.round(delayMs / 10),
      transparent: transparentIndex,
      disposal: 2,
    });
  }

  const buffer = buf.slice(0, gif.end());
  const uintBuffer = new Uint8Array(buffer);
  return { buffer: uintBuffer };
}

export const gifHelper: GifHelpersType = { createGif };
