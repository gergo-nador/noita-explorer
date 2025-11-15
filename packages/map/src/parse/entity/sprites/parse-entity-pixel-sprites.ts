import {
  ChunkEntity,
  ChunkEntityComponent,
  DataWakMediaIndex,
} from '@noita-explorer/model-noita';
import {
  ChunkRenderableEntity,
  ChunkRenderableEntitySprite,
} from '../../../interfaces/chunk-renderable-entity.ts';
import { StringKeyDictionary } from '@noita-explorer/model';

interface Props {
  entity: ChunkEntity;
  renderableEntity: ChunkRenderableEntity;
  pixelSprites: ChunkEntityComponent[];
  mediaIndex: StringKeyDictionary<DataWakMediaIndex>;
}

export async function parseEntityPixelSprites({
  entity,
  renderableEntity,
  pixelSprites,
  mediaIndex,
}: Props) {
  for (const pixelSprite of pixelSprites) {
    const imageFile = pixelSprite.data?.image_file;

    if (typeof imageFile === 'string' && imageFile.length > 0) {
      const mediaDimension = mediaIndex[imageFile];
      if (!mediaDimension) continue;

      const sprite: ChunkRenderableEntitySprite = {
        position: entity.position,
        rotation: entity.rotation,
        offset: { x: 0, y: 0 },
        size: { x: mediaDimension.size.width, y: mediaDimension.size.height },
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
