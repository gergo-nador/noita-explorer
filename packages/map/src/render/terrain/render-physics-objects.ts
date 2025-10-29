import { ChunkRenderable } from '../../interfaces/chunk-renderable.ts';
import { Vector2d } from '@noita-explorer/model';
import { colorHelpers } from '@noita-explorer/tools';
import { renderTileRenderable } from '../../utils/render-tile-renderable.ts';
import { ChunkPhysicsObject } from '@noita-explorer/model-noita';

interface Props {
  physicsObjects: ChunkPhysicsObject[];
  chunkCoordinates: Vector2d;
  chunkImageData: ImageData;
}

export function renderPhysicsObjects({
  physicsObjects,
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

        return colorHelpers.conversion.fromAbgrNumber(color).toRgbaNum();
      },
    };

    renderTileRenderable({
      chunkCoordinates,
      chunkImageData,
      chunkRenderable,
    });
  }
}
