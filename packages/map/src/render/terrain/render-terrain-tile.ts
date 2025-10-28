import { StringKeyDictionary, ValueRef } from '@noita-explorer/model';
import { ChunkFileFormat, NoitaMaterial } from '@noita-explorer/model-noita';
import { renderPixelatedImage } from '../../utils/render-pixelated-image.ts';
import { calculateTerrainPixel } from './calculate-terrain-pixel.ts';

interface Props {
  imageData: ImageData;
  chunk: ChunkFileFormat;
  materials: StringKeyDictionary<NoitaMaterial>;
  materialImageCache: StringKeyDictionary<ImageData>;
  materialColorCache: StringKeyDictionary<number>;
}

export function renderTerrainTile({
  imageData,
  chunk,
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
}
