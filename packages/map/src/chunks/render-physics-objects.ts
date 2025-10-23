import { ChunkPhysicsObject } from './chunk-physics-object.ts';
import { ChunkRawFormat } from './chunk-raw-format.ts';
import { Vector2d } from '@noita-explorer/model';
import { renderChunkRenderable } from './render-chunk-renderable.ts';
import { ChunkRenderable } from './chunk-renderable.ts';
import { colorHelpers } from '@noita-explorer/tools';

interface Props {
  physicsObjects: ChunkPhysicsObject[];
  chunk: ChunkRawFormat;
  chunkCoordinates: Vector2d;
  chunkImageData: ImageData;
}

export function renderPhysicsObjects({
  physicsObjects,
  chunk,
  chunkCoordinates,
  chunkImageData,
}: Props) {
  for (const physicsObject of physicsObjects) {
    const chunkRenderable: ChunkRenderable = {
      position: physicsObject.position,
      rotation: physicsObject.rotation,
      scale: { x: 1, y: 1 },
      width: physicsObject.width,
      height: physicsObject.height,
      getPixel: (coords: Vector2d) => {
        const colorIndex = physicsObject.width * coords.y + coords.x;
        const color = physicsObject.pixelData[colorIndex];

        return colorHelpers.conversion.fromAbgrNumber(color).toRgbaObj();
      },
    };

    renderChunkRenderable({
      chunkCoordinates,
      chunk,
      chunkImageData,
      chunkRenderable,
    });
  }
}
