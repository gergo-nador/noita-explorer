import {
  ChunkEntity,
  ChunkEntityComponent,
  DataWakMediaIndex,
} from '@noita-explorer/model-noita';
import {
  ChunkRenderableEntity,
  ChunkRenderableEntitySprite,
} from '../../../interfaces/chunk-renderable-entity.ts';
import { StringKeyDictionary, Vector2d } from '@noita-explorer/model';
import { subtractRotatedVector } from '../../../utils/subtract-rotated-vector.ts';

interface Props {
  entity: ChunkEntity;
  renderableEntity: ChunkRenderableEntity;
  components: ChunkEntityComponent[];
  mediaIndex: StringKeyDictionary<DataWakMediaIndex>;
}

export function parseEntityPhysicsImageShapeComponent({
  entity,
  mediaIndex,
  components,
  renderableEntity,
}: Props) {
  for (const component of components) {
    const imageFile = component.data.image_file as string | undefined;

    if (imageFile) {
      const mediaDimension = mediaIndex[imageFile];
      if (!mediaDimension) continue;

      const offset: Vector2d = {
        x: (component.data.offset_x ?? 0) as number,
        y: (component.data.offset_y ?? 0) as number,
      };

      const sprite: ChunkRenderableEntitySprite = {
        position: subtractRotatedVector(
          entity.position,
          offset,
          entity.rotation,
        ),
        rotation: entity.rotation,
        offset: offset,
        size: { x: mediaDimension.size.width, y: mediaDimension.size.height },
        scale: entity.scale,
        mediaPath: imageFile,
        isBackgroundComponent: false,
      };

      renderableEntity.sprites.push(sprite);
    }
  }
}
