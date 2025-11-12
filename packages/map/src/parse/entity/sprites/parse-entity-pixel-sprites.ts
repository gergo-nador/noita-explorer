import { ChunkEntity, ChunkEntityComponent } from '@noita-explorer/model-noita';
import {
  ChunkRenderableEntity,
  ChunkRenderableEntitySprite,
} from '../../../interfaces/chunk-renderable-entity.ts';

interface Props {
  entity: ChunkEntity;
  renderableEntity: ChunkRenderableEntity;
  pixelSprites: ChunkEntityComponent[];
}

export async function parseEntityPixelSprites({
  entity,
  renderableEntity,
  pixelSprites,
}: Props) {
  for (const pixelSprite of pixelSprites) {
    const imageFile = pixelSprite.data?.image_file;

    if (typeof imageFile === 'string' && imageFile.length > 0) {
      const sprite: ChunkRenderableEntitySprite = {
        position: entity.position,
        rotation: entity.rotation,
        offset: { x: 0, y: 0 },
        scale: entity.scale,
        mediaPath: imageFile,
        isBackgroundComponent: Boolean(
          pixelSprite.data?.clean_overlapping_pixels,
        ),
      };

      renderableEntity.sprites.push(sprite);
    }
  }
}
