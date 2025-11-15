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
    if (!sprite.enabled) continue;

    const imageFile = sprite.data?.image_file;
    if (typeof imageFile === 'string' && imageFile.length > 0) {
      const mediaDimension = mediaIndex[imageFile];
      if (!mediaDimension) continue;

      //debugger;

      const offset = {
        x: (sprite.data.offset_x ?? 0) as number,
        y: (sprite.data.offset_y ?? 0) as number,
      };

      const renderableSprite: ChunkRenderableEntitySprite = {
        position: {
          x: entity.position.x - offset.x,
          y: entity.position.y - offset.y,
        },
        rotation: entity.rotation,
        size: { x: mediaDimension.size.width, y: mediaDimension.size.height },
        offset: offset,
        scale: entity.scale,
        mediaPath: imageFile,
        isBackgroundComponent: false,
      };

      renderableEntity.sprites.push(renderableSprite);
    }
  }
}
