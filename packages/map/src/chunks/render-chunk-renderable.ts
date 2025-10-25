import { ChunkRenderable } from './chunk-renderable.ts';
import { Vector2d } from '@noita-explorer/model';
import { ChunkFileFormat } from '@noita-explorer/model-noita';

interface Props {
  chunkRenderable: ChunkRenderable;
  chunk: ChunkFileFormat;
  chunkCoordinates: Vector2d;
  chunkImageData: ImageData;
}
export function renderChunkRenderable({
  chunkRenderable,
  chunk,
  chunkCoordinates,
  chunkImageData,
}: Props) {
  const position = chunkRenderable.position;
  const rotation = chunkRenderable.rotation;

  const width = chunkRenderable.width;
  const height = chunkRenderable.height;

  const localX = Math.round(position.x) - chunk.width * chunkCoordinates.x;
  const localY = Math.round(position.y) - chunk.height * chunkCoordinates.y;

  // smart optimization trick from @pudy248
  let lx = localX;
  let ly = localY;

  let ux = lx;
  let uy = ly;

  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);

  if (cosine > 0) {
    ux = Math.trunc(ux + width * cosine);
    uy = Math.trunc(uy + height * cosine);
  } else {
    lx = Math.trunc(lx + width * cosine);
    ly = Math.trunc(ly + height * cosine);
  }

  if (sine > 0) {
    lx = Math.trunc(lx - height * sine);
    uy = Math.trunc(uy + width * sine);
  } else {
    ux = Math.trunc(ux - height * sine);
    ly = Math.trunc(ly + width * sine);
  }

  lx = Math.min(Math.max(lx, 0), 511);
  ly = Math.min(Math.max(ly, 0), 511);
  ux = Math.min(Math.max(ux, 0), 511);
  uy = Math.min(Math.max(uy, 0), 511);

  for (let pixY = ly; pixY < uy; pixY++) {
    for (let pixX = lx; pixX < ux; pixX++) {
      const offsetPixX = pixX - localX;
      const offsetPixY = pixY - localY;

      const texX = Math.round(offsetPixX * cosine + offsetPixY * sine);
      const texY = Math.round(-offsetPixX * sine + offsetPixY * cosine);

      if (texX < 0 || width <= texX || texY < 0 || height <= texY) {
        continue;
      }

      const color = chunkRenderable.getPixel({ x: texX, y: texY });
      if (color.a === 0) continue;

      const index = (pixY * chunk.width + pixX) * 4;

      const data = chunkImageData.data;

      if (chunkRenderable.isAdditive) {
        const destR = data[index];
        if (destR < 128) {
          data[index] = (2 * destR * color.r) / 255;
        } else {
          data[index] = 255 - (2 * (255 - destR) * (255 - color.r)) / 255;
        }

        const destG = data[index + 1];
        if (destG < 128) {
          data[index + 1] = (2 * destG * color.g) / 255;
        } else {
          data[index + 1] = 255 - (2 * (255 - destG) * (255 - color.g)) / 255;
        }

        const destB = data[index + 2];
        if (destB < 128) {
          data[index + 2] = (2 * destB * color.b) / 255;
        } else {
          data[index + 2] = 255 - (2 * (255 - destB) * (255 - color.b)) / 255;
        }

        const a = data[index + 3];
        data[index + 3] = Math.max(a, color.a);
      } else {
        data[index] += color.r;
        data[index + 1] += color.g;
        data[index + 2] += color.b;
        data[index + 3] = color.a;
      }
    }
  }
}
