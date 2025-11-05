import { StringKeyDictionary, ValueRef, Vector2d } from '@noita-explorer/model';
import { ChunkFileFormat, NoitaMaterial } from '@noita-explorer/model-noita';
import { renderPixelatedImage } from '../../utils/render-pixelated-image.ts';
import { calculateTerrainPixel } from './calculate-terrain-pixel.ts';
import { renderPhysicsObjects } from './render-physics-objects.ts';

interface Props {
  imageData: ImageData;
  chunk: ChunkFileFormat;
  chunkCoordinates: Vector2d;
  materials: StringKeyDictionary<NoitaMaterial>;
  materialImageCache: StringKeyDictionary<ImageData>;
  materialColorCache: StringKeyDictionary<number>;
}

export function renderTerrainTile({
  imageData,
  chunk,
  chunkCoordinates,
  materials,
  materialImageCache,
  materialColorCache,
}: Props) {
  const customColorIndexRef: ValueRef<number> = { value: 0 };

  renderPixelatedImage({
    imageData,
    width: chunk.width,
    height: chunk.height,
    calculatePixel: (x, y) =>
      calculateTerrainPixel({
        x,
        y,
        chunk,
        customColorIndexRef,
        materials,
        materialImageCache,
        materialColorCache,
      }),
  });

  renderPhysicsObjects({
    physicsObjects: chunk.physicsObjects,
    chunkCoordinates: chunkCoordinates,
    chunkImageData: imageData,
  });
}
