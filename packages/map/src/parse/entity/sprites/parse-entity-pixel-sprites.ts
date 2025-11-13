import { ChunkEntity, ChunkEntityComponent } from '@noita-explorer/model-noita';
import {
  ChunkRenderableEntity,
  ChunkRenderableEntitySprite,
} from '../../../interfaces/chunk-renderable-entity.ts';
import { ImagePngDimension, StringKeyDictionary } from '@noita-explorer/model';

interface Props {
  entity: ChunkEntity;
  renderableEntity: ChunkRenderableEntity;
  pixelSprites: ChunkEntityComponent[];
  mediaDimensions: StringKeyDictionary<ImagePngDimension>;
}

export async function parseEntityPixelSprites({
  entity,
  renderableEntity,
  pixelSprites,
  mediaDimensions,
}: Props) {
  for (const pixelSprite of pixelSprites) {
    const imageFile = pixelSprite.data?.image_file;

    if (typeof imageFile === 'string' && imageFile.length > 0) {
      const mediaDimension = mediaDimensions[imageFile];
      if (!mediaDimension) continue;

      const sprite: ChunkRenderableEntitySprite = {
        position: entity.position,
        rotation: entity.rotation,
        offset: { x: 0, y: 0 },
        size: { x: mediaDimension.width, y: mediaDimension.height },
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
