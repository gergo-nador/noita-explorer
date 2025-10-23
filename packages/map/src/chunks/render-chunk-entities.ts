import { ChunkRawFormat } from './chunk-raw-format.ts';
import { Vector2d } from '@noita-explorer/model';
import { renderChunkRenderable } from './render-chunk-renderable.ts';
import { ChunkRenderable } from './chunk-renderable.ts';
import { ChunkRenderableEntity } from './chunk-renderable-entity.ts';

interface Props {
  entities: ChunkRenderableEntity[];
  chunk: ChunkRawFormat;
  chunkCoordinates: Vector2d;
  chunkImageData: ImageData;
  renderMode: 'regular' | 'background';
}

export function renderChunkEntities({
  entities,
  chunkCoordinates,
  chunk,
  chunkImageData,
  renderMode,
}: Props) {
  for (const entity of entities) {
    for (const sprite of entity.sprites) {
      if (renderMode === 'background' && !sprite.isBackgroundComponent)
        continue;
      if (renderMode === 'regular' && sprite.isBackgroundComponent) continue;

      const chunkRenderable: ChunkRenderable = {
        scale: sprite.scale,
        position: sprite.position,
        height: sprite.imageData.height,
        width: sprite.imageData.width,
        rotation: sprite.rotation,
        isAdditive: sprite.isAdditive,
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
