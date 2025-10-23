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
}

export function renderChunkEntities({
  entities,
  chunkCoordinates,
  chunk,
  chunkImageData,
}: Props) {
  for (const entity of entities) {
    const chunkRenderable: ChunkRenderable = {
      scale: entity.scale,
      position: entity.position,
      height: entity.imageData.height,
      width: entity.imageData.width,
      rotation: entity.rotation,
      getPixel: (coords) => {
        const index = entity.imageData.width * coords.y + coords.x;

        const r = entity.imageData.data[index];
        const g = entity.imageData.data[index + 1];
        const b = entity.imageData.data[index + 2];
        const a = entity.imageData.data[index + 3];

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
