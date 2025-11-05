import { ChunkRenderable } from '../interfaces/chunk-renderable.ts';
import { Vector2d } from '@noita-explorer/model';
import { mapConstants } from '../map-constants.ts';

interface Props {
  chunkRenderable: ChunkRenderable;
  chunkCoordinates: Vector2d;
  chunkImageData: ImageData;
}
export function renderTileRenderable({
  chunkRenderable,
  chunkCoordinates,
  chunkImageData,
}: Props) {
  const position = chunkRenderable.position;
  const rotation = chunkRenderable.rotation;

  const width = chunkRenderable.width;
  const height = chunkRenderable.height;

  const localX =
    Math.round(position.x) - mapConstants.chunkWidth * chunkCoordinates.x;
  const localY =
    Math.round(position.y) - mapConstants.chunkHeight * chunkCoordinates.y;

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

      const alpha = color & 0xff;
      const isTransparent = alpha === 0;
      if (isTransparent) continue;

      const index = (pixY * mapConstants.chunkWidth + pixX) * 4;

      const data = chunkImageData.data;

      const r = (color >>> 24) & 0xff;
      const g = (color >>> 16) & 0xff;
      const b = (color >>> 8) & 0xff;
      const alphaMultiplier = alpha / 255;

      const oldR = data[index] * (1 - alphaMultiplier);
      const oldG = data[index + 1] * (1 - alphaMultiplier);
      const oldB = data[index + 2] * (1 - alphaMultiplier);

      data[index] = Math.min(oldR + r * alphaMultiplier, 255);
      data[index + 1] = Math.min(oldG + g * alphaMultiplier, 255);
      data[index + 2] = Math.min(oldB + b * alphaMultiplier, 255);
      data[index + 3] = Math.min(data[index + 3] + alpha, 255);
    }
  }
}
