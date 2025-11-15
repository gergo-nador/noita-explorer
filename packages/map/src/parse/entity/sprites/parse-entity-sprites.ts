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
  sprites: ChunkEntityComponent[];
  mediaIndex: StringKeyDictionary<DataWakMediaIndex>;
}

export async function parseEntitySprites({
  entity,
  renderableEntity,
  sprites,
  mediaIndex,
}: Props) {
  for (const sprite of sprites) {
    const imageFile = sprite.data?.image_file;
    if (typeof imageFile === 'string' && imageFile.length > 0) {
      const mediaDimension = mediaIndex[imageFile];
      if (!mediaDimension) continue;

      const renderableSprite: ChunkRenderableEntitySprite = {
        position: entity.position,
        rotation: entity.rotation,
        size: { x: mediaDimension.size.width, y: mediaDimension.size.height },
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
