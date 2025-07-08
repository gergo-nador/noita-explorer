import { FileSystemDirectoryAccessNode } from '../src/file-system/file-system-directory-access-node';
import { scrapeExperimental } from '@noita-explorer/scrapers';
import fs from 'fs';
import { GifWriter } from 'omggif';
import { createCanvas, loadImage } from 'canvas';
import { imageHelpers, base64Helpers } from '@noita-explorer/tools';

const dataParentFolder = '/Users/gergo.nador/noita-explorer/noita_data';
const folder = FileSystemDirectoryAccessNode(dataParentFolder);

scrapeExperimental
  .scrapeAnimations({
    dataWakParentDirectoryApi: folder,
  })
  .then(async (res) => {
    for (const animation of res.animations) {
      let i = 0;
      for (const image of animation.frameImages) {
        const base64Image = base64Helpers.trimMetadata(image);

        // Convert to binary buffer
        const imageBuffer = Buffer.from(base64Image, 'base64');

        // Write to a file
        fs.writeFileSync(
          `/Users/gergo.nador/noita-explorer/noita_data/animations_test/${animation.animation.name}-${i}.png`,
          imageBuffer,
        );
        i++;
      }

      const gifBuffer = await createGif({
        frames: animation.frameImages,
        delayMs: animation.animation.frameWait * 1000,
        repeat: animation.animation.loop,
      });
      fs.writeFileSync(
        `/Users/gergo.nador/noita-explorer/noita_data/animations_gifs/${animation.animation.name}.gif`,
        gifBuffer,
      );
    }
  });

function quantizeColors(imageData, maxColors = 256) {
  const pixels = imageData.data;
  const colorMap = new Map();
  const palette = [];

  // Extract unique colors
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    // Handle transparency
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

  // Create indexed image data
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
    indexedData,
    palette: palette, // Flatten to [r,g,b,r,g,b,...]
    transparentIndex: colorMap.has('transparent')
      ? colorMap.get('transparent')
      : null,
  };
}

async function createGif({
  frames,
  delayMs,
  repeat,
}: {
  frames: string[];
  delayMs: number;
  repeat: boolean;
}) {
  const { width, height } = await imageHelpers.getImageSizeBase64(frames[0]);

  // Create output buffer (estimate size)
  const buf = new Uint8Array(width * height * frames.length * 2);
  const gif = new GifWriter(buf, width, height, {
    loop: repeat ? 0 : undefined,
  });

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d', { alpha: true });

  for (const base64 of frames) {
    const img = await loadImage(base64);

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, width, height);

    // Quantize colors and create indexed data
    const { indexedData, palette, transparentIndex } =
      quantizeColors(imageData);

    // Add frame to GIF
    gif.addFrame(0, 0, width, height, indexedData, {
      palette,
      delay: Math.round(delayMs / 10), // omggif uses centiseconds
      transparent: transparentIndex,
      disposal: 2, // Clear frame after display
    });
  }

  // Return the actual used portion of the buffer
  return buf.slice(0, gif.end());
}
