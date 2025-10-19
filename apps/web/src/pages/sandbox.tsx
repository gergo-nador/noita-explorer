import { useEffect, useState } from 'react';
import { getSave00FolderHandle } from '../utils/browser-noita-api/browser-noita-api.ts';
import { FileSystemFileAccess } from '@noita-explorer/model';
import { useSave00Store } from '../stores/save00.ts';
import { testParseChunk, ChunkRawFormat } from '@noita-explorer/map';
import { useNoitaDataWakStore } from '../stores/noita-data-wak.ts';
import { colorHelpers } from '@noita-explorer/tools';
import { publicPaths } from '../utils/public-paths.ts';

export const Sandbox = () => {
  const { status } = useSave00Store();
  const { data } = useNoitaDataWakStore();
  const [petriFiles, setFiles] = useState<FileSystemFileAccess[]>([]);
  const [materialImageCache, setMaterialImageCache] =
    useState<Record<string, CanvasRenderingContext2D>>();

  useEffect(() => {
    async function collectImages() {
      if (!data?.materials) return;

      const cache: Record<string, CanvasRenderingContext2D> = {};

      for (const material of data.materials) {
        if (!material.hasGraphicsImage) continue;
        const imagePath = publicPaths.generated.material.image({
          materialId: material.id,
        });
        await new Promise((resolve, reject) => {
          const img = new Image();
          // This is crucial for images from other domains (CORS)
          img.crossOrigin = 'Anonymous';
          img.src = imagePath;

          img.onload = () => {
            // Create an invisible canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            // Set canvas dimensions to match the image
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the image onto the canvas
            ctx.drawImage(img, 0, 0);
            cache[material.id] = ctx;

            resolve(1);
          };

          img.onerror = () => {
            reject(`Failed to load the image from: ${imagePath}`);
          };
        });
      }

      setMaterialImageCache(cache);
    }
    collectImages();
  }, [data?.materials]);

  useEffect(() => {
    if (status !== 'loaded') return;

    getSave00FolderHandle()
      .then((folder) => folder.getDirectory('world'))
      .then((folder) => folder.listFiles())
      .then((files) =>
        files.filter((file) => file.getName().endsWith('.png_petri')),
      )
      .then((files) =>
        setFiles(files.sort((a, b) => a.getName().localeCompare(b.getName()))),
      );
  }, [status]);

  return (
    <div style={{ width: '100%', height: '90vh', zIndex: 1 }}>
      <div>{status}</div>
      {materialImageCache &&
        petriFiles?.map((file) => (
          <Chunk file={file} materialImageCache={materialImageCache} />
        ))}
    </div>
  );
};

const Chunk = ({
  file,
  materialImageCache,
}: {
  file: FileSystemFileAccess;
  materialImageCache: Record<string, CanvasRenderingContext2D>;
}) => {
  const [chunk, setChunk] = useState<ChunkRawFormat>();
  const [imageUrl, setImageUrl] = useState<string>();
  const { lookup } = useNoitaDataWakStore();

  useEffect(() => {
    if (!chunk) return;
    if (!lookup?.materials) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      console.error('2D context not available!');
      return;
    }

    const materialColorCache: Record<
      string,
      { r: number; g: number; b: number; a: number }
    > = {};

    let customColorIndex = 0;
    const chunkCalculator: PixelCalculator = (x, y) => {
      const i = y * 512 + x;
      const cellData = chunk.cellData[i];

      const isCustomColor = (cellData & 0x80) !== 0;
      if (isCustomColor) {
        const customColor = chunk.customColors[customColorIndex];
        customColorIndex++;

        const color = colorHelpers.conversion
          .fromArgbNumber(customColor)
          .toRgbaObj();

        return color;
      }

      const materialId = chunk.materialIds[cellData];
      if (materialId === 'air') {
        return { r: 0, g: 0, b: 0, a: 0 } satisfies Color;
      }

      if (materialId in materialColorCache) {
        return materialColorCache[materialId];
      }

      const material = lookup.materials[materialId];
      if (!material) {
        return { r: 0, g: 0, b: 0, a: 0 } satisfies Color;
      }

      if (material.hasGraphicsImage) {
        const ctx: CanvasRenderingContext2D = materialImageCache[materialId];

        const wx = (x + chunk.width) * 6;
        const wy = (y + chunk.height) * 6;

        const colorX = wx % ctx.canvas.width;
        const colorY = wy % ctx.canvas.height;

        const pixelData = ctx.getImageData(colorX, colorY, 1, 1).data;

        const color = {
          r: pixelData[0],
          g: pixelData[1],
          b: pixelData[2],
          a: pixelData[3],
        };

        return color;
      }

      const matColor = colorHelpers.conversion
        .fromArgbString(material.graphicsColor ?? material.wangColor)
        .toRgbaObj();

      materialColorCache[materialId] = matColor;

      matColor.a = 255;

      return matColor;
    };
    renderPixelatedImage(ctx, chunk.width, chunk.height, chunkCalculator);
    const imageURL = canvas.toDataURL('image/png');
    setImageUrl(imageURL);
  }, [chunk, lookup]);

  if (!chunk) {
    return (
      <div onClick={() => testParseChunk(file).then((c) => setChunk(c))}>
        {file.getName()}
      </div>
    );
  }

  return (
    <div>
      {imageUrl ? (
        <img src={imageUrl} style={{ background: 'white', zoom: 3 }} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

/**
 * Represents an RGBA color. Values should be 0-255.
 */
type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
};

/**
 * The template for your pixel logic.
 * This function is called for every single pixel on the canvas.
 * @param x - The horizontal coordinate of the pixel.
 * @param y - The vertical coordinate of the pixel.
 * @param width - The total width of the canvas.
 * @param height - The total height of the canvas.
 * @returns A Color object for the pixel at (x, y).
 */
type PixelCalculator = (
  x: number,
  y: number,
  width: number,
  height: number,
) => Color;

/**
 * Renders an image on the canvas pixel by pixel using a calculator function.
 * @param ctx The 2D rendering context of the canvas.
 * @param width The width of the area to render.
 * @param height The height of the area to render.
 * @param calculatePixel Your function that defines the color of each pixel.
 */
function renderPixelatedImage(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  calculatePixel: PixelCalculator,
) {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = calculatePixel(x, y, width, height);

      const index = (y * width + x) * 4;

      data[index] = color.r;
      data[index + 1] = color.g;
      data[index + 2] = color.b;
      data[index + 3] = color.a;
    }
  }

  // Put the modified pixel data back onto the canvas
  ctx.putImageData(imageData, 0, 0);
}
