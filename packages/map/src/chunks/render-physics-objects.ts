import { ChunkPhysicsObject } from './chunk-physics-object.ts';
import { ChunkRawFormat } from './chunk-raw-format.ts';
import { Vector2d } from '@noita-explorer/model';

interface Props {
  physicsObjects: ChunkPhysicsObject[];
  chunk: ChunkRawFormat;
  chunkCoordinates: Vector2d;
  imageData: ImageData;
}

export function renderPhysicsObjects({
  physicsObjects,
  chunk,
  chunkCoordinates,
  imageData,
}: Props) {
  for (const physicsObject of physicsObjects) {
    const localX =
      Math.round(physicsObject.position.x) - chunk.width * chunkCoordinates.x;
    const localY =
      Math.round(physicsObject.position.y) - chunk.height * chunkCoordinates.y;

    // smart optimization trick from @pudy248
    let lx = localX;
    let ly = localY;

    let ux = lx;
    let uy = ly;

    const cosine = Math.cos(physicsObject.rotation);
    const sine = Math.sin(physicsObject.rotation);

    if (cosine > 0) {
      ux = Math.trunc(ux + physicsObject.width * cosine);
      uy = Math.trunc(uy + physicsObject.height * cosine);
    } else {
      lx = Math.trunc(lx + physicsObject.width * cosine);
      ly = Math.trunc(ly + physicsObject.height * cosine);
    }

    if (sine > 0) {
      lx = Math.trunc(lx - physicsObject.height * sine);
      uy = Math.trunc(uy + physicsObject.width * sine);
    } else {
      ux = Math.trunc(ux - physicsObject.height * sine);
      ly = Math.trunc(ly + physicsObject.width * sine);
    }

    lx = Math.min(Math.max(lx, 0), 511);
    ly = Math.min(Math.max(ly, 0), 511);
    ux = Math.min(Math.max(ux, 0), 511);
    uy = Math.min(Math.max(uy, 0), 511);

    const data = imageData.data;

    for (let pixY = ly; pixY < uy; pixY++) {
      for (let pixX = lx; pixX < ux; pixX++) {
        const offsetPixX = pixX - localX;
        const offsetPixY = pixY - localY;

        const texX = Math.round(offsetPixX * cosine + offsetPixY * sine);
        const texY = Math.round(-offsetPixX * sine + offsetPixY * cosine);

        if (
          texX < 0 ||
          physicsObject.width <= texX ||
          texY < 0 ||
          physicsObject.height <= texY
        ) {
          continue;
        }

        const colorIndex = physicsObject.width * texY + texX;
        const color = physicsObject.pixelData[colorIndex];

        if (color >> 24 === 0) {
          continue;
        }

        const a = (color & 0xff000000) >>> 24;
        const b = (color & 0x00ff0000) >>> 16;
        const g = (color & 0x0000ff00) >>> 8;
        const r = (color & 0x000000ff) >>> 0;

        const index = (pixY * chunk.width + pixX) * 4;

        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = a;
      }
    }
  }
}
