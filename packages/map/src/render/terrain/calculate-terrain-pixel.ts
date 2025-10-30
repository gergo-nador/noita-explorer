import { StringKeyDictionary, ValueRef } from '@noita-explorer/model';
import { colorHelpers } from '@noita-explorer/tools';
import { ChunkFileFormat, NoitaMaterial } from '@noita-explorer/model-noita';

interface Props {
  x: number;
  y: number;
  chunk: ChunkFileFormat;
  customColorIndexRef: ValueRef<number>;
  materials: StringKeyDictionary<NoitaMaterial>;
  materialImageCache: StringKeyDictionary<ImageData>;
  materialColorCache: StringKeyDictionary<number>;
}

export function calculateTerrainPixel({
  x,
  y,
  chunk,
  customColorIndexRef,
  materials,
  materialColorCache,
  materialImageCache,
}: Props): number {
  const i = y * chunk.width + x;
  const cellData = chunk.cellData[i];

  const isCustomColor = cellData >= 128;
  if (isCustomColor) {
    const customColor = chunk.customColors[customColorIndexRef.value];
    customColorIndexRef.value++;

    const o1 = (customColor & 0xff000000) >>> 24;
    const o2 = (customColor & 0x00ff0000) >>> 16;
    const o3 = (customColor & 0x0000ff00) >>> 8;
    const o4 = (customColor & 0x000000ff) >>> 0;

    const rgba = (o4 << 24) | (o3 << 16) | (o2 << 8) | o1;
    return rgba;
  }

  const materialId = chunk.materialIds[cellData];
  if (materialId === 'air') {
    return 0;
  }

  if (materialId in materialColorCache) {
    return materialColorCache[materialId];
  }

  const material = materials[materialId];
  if (!material) {
    return 0;
  }

  if (material.hasGraphicsImage) {
    const materialImageData = materialImageCache[materialId];

    const wx = x + chunk.width;
    const wy = y + chunk.height;

    const colorX = wx % materialImageData.width;
    const colorY = wy % materialImageData.height;

    const pixelData = materialImageData.data;
    const index = (colorY * materialImageData.width + colorX) * 4;

    const r = pixelData[index];
    const g = pixelData[index + 1];
    const b = pixelData[index + 2];
    const a = pixelData[index + 3];

    const color = (r << 24) | (g << 16) | (b << 8) | a;
    const unsignedColor = color >>> 0;

    return unsignedColor;
  }

  const matColor = colorHelpers.conversion
    .fromRgbaString(material.graphicsColor ?? material.wangColorHtml)
    .toRgbaNum();

  materialColorCache[materialId] = matColor;

  return matColor;
}
