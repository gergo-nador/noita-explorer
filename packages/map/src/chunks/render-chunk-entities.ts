import { Vector2d } from '@noita-explorer/model';
import { renderChunkRenderable } from './render-chunk-renderable.ts';
import { ChunkRenderable } from './chunk-renderable.ts';
import { ChunkRenderableEntity } from './chunk-renderable-entity.ts';
import { ChunkFileFormat } from '@noita-explorer/model-noita';

interface Props {
  entities: ChunkRenderableEntity[];
  chunk: ChunkFileFormat;
  chunkCoordinates: Vector2d;
  chunkImageData: ImageData;
}

export function renderChunkEntities({
  entities,
  chunkCoordinates,
  chunk,
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

          return { r, g, b, a };
        },
      };

      renderChunkRenderable({
        chunkImageData,
        chunk,
        chunkCoordinates,
        chunkRenderable,
      });
    }
  }
}
