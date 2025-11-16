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
import { subtractRotatedVector } from '../../../utils/subtract-rotated-vector.ts';

interface Props {
  entity: ChunkEntity;
  renderableEntity: ChunkRenderableEntity;
  sprites: ChunkEntityComponent[];
  mediaIndex: StringKeyDictionary<DataWakMediaIndex>;
}

export function parseEntitySprites({
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

      const offset = {
        x: (sprite.data.offset_x ?? 0) as number,
        y: (sprite.data.offset_y ?? 0) as number,
      };

      if (offset.x === 0 && mediaDimension.offset?.x)
        offset.x += mediaDimension.offset.x;
      if (offset.y === 0 && mediaDimension.offset?.y)
        offset.y += mediaDimension.offset.y;

      const renderableSprite: ChunkRenderableEntitySprite = {
        position: subtractRotatedVector(
          entity.position,
          offset,
          entity.rotation,
        ),
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
