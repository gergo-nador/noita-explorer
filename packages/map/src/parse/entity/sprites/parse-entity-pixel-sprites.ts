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
  pixelSprites: ChunkEntityComponent[];
  mediaIndex: StringKeyDictionary<DataWakMediaIndex>;
}

export function parseEntityPixelSprites({
  entity,
  renderableEntity,
  pixelSprites,
  mediaIndex,
}: Props) {
  for (const pixelSprite of pixelSprites) {
    if (!pixelSprite.enabled) continue;

    let imageFile = pixelSprite.data?.image_file as string | undefined;

    const offset: Vector2d = {
      x: 0,
      y: 0,
    };

    // check for mPixelSprite as well
    if (!imageFile) {
      const mPixelSprite = pixelSprite.data?.mPixelSprite;
      if (typeof mPixelSprite === 'object' && mPixelSprite) {
        const item = 1 in mPixelSprite && mPixelSprite[1];
        if (Array.isArray(item)) {
          // ['1', 'data/vegetation/mushroom_small_03.png']
          const tempImageFile = item[1];
          if (
            typeof tempImageFile === 'string' &&
            tempImageFile.startsWith('data')
          ) {
            imageFile = tempImageFile;
          }
        }

        const offsetXItem = 7 in mPixelSprite && mPixelSprite[7];
        if (Array.isArray(offsetXItem)) {
          offset.x = offsetXItem[1];
        }
        const offsetYItem = 8 in mPixelSprite && mPixelSprite[8];
        if (Array.isArray(offsetYItem)) {
          offset.y = offsetYItem[1];
        }
      }
    }

    if (typeof imageFile === 'string' && imageFile.length > 0) {
      const mediaDimension = mediaIndex[imageFile];
      if (!mediaDimension) continue;

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
        isBackgroundComponent: Boolean(
          pixelSprite.data?.clean_overlapping_pixels,
        ),
      };

      renderableEntity.sprites.push(sprite);
    }
  }
}
