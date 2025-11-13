import { ChunkEntity, ChunkEntityComponent } from '@noita-explorer/model-noita';
import {
  ChunkRenderableEntity,
  ChunkRenderableEntitySprite,
} from '../../../interfaces/chunk-renderable-entity.ts';
import { ImagePngDimension, StringKeyDictionary } from '@noita-explorer/model';

interface Props {
  entity: ChunkEntity;
  renderableEntity: ChunkRenderableEntity;
  sprites: ChunkEntityComponent[];
  mediaDimensions: StringKeyDictionary<ImagePngDimension>;
}

export async function parseEntitySprites({
  entity,
  renderableEntity,
  sprites,
  mediaDimensions,
}: Props) {
  for (const sprite of sprites) {
    const imageFile = sprite.data?.image_file;
    if (typeof imageFile === 'string' && imageFile.length > 0) {
      const mediaDimension = mediaDimensions[imageFile];
      if (!mediaDimension) continue;

      const renderableSprite: ChunkRenderableEntitySprite = {
        position: entity.position,
        rotation: entity.rotation,
        size: { x: mediaDimension.width, y: mediaDimension.height },
        offset: {
          x: (sprite.data.offset_x ?? 0) as number,
          y: (sprite.data.offset_y ?? 0) as number,
        },
        scale: entity.scale,
        mediaPath: imageFile,
        isBackgroundComponent: false,
      };

      renderableEntity.sprites.push(renderableSprite);
    }
  }
}
