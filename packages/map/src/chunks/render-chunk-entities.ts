/*import { Vector2d } from '@noita-explorer/model';
import { renderTileRenderable } from '../utils/render-tile-renderable.ts';
import { ChunkRenderable } from '../interfaces/chunk-renderable.ts';
import { ChunkRenderableEntity } from '../interfaces/chunk-renderable-entity.ts';

interface Props {
  entities: ChunkRenderableEntity[];
  chunkCoordinates: Vector2d;
  chunkImageData: ImageData;
}

export function renderChunkEntities({
  entities,
  chunkCoordinates,
  chunkImageData,
}: Props) {
  for (const entity of entities) {
    for (const sprite of entity.sprites) {
      if (!sprite.isBackgroundComponent) continue;

      const chunkRenderable: ChunkRenderable = {
        scale: sprite.scale,
        position: sprite.position,
        height: sprite.imageData.height,
        width: sprite.imageData.width,
        rotation: sprite.rotation,
        getPixel: (coords) => {
          const index = (sprite.imageData.width * coords.y + coords.x) * 4;

          const r = sprite.imageData.data[index];
          const g = sprite.imageData.data[index + 1];
          const b = sprite.imageData.data[index + 2];
          const a = sprite.imageData.data[index + 3];

          const rgba = (r << 24) | (g << 16) | (b << 8) | a;
          return rgba;
        },
      };

      renderTileRenderable({
        chunkImageData,
        chunkCoordinates,
        chunkRenderable,
      });
    }
  }
}
*/
