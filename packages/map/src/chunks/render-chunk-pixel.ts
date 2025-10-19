import {
  RgbaColor,
  StringKeyDictionary,
  ValueRef,
} from '@noita-explorer/model';
import { NoitaMaterial } from '@noita-explorer/model-noita';
import { colorHelpers } from '@noita-explorer/tools';
import { ChunkRawFormat } from '../interfaces/chunk-raw-format.ts';

interface Props {
  x: number;
  y: number;
  chunk: ChunkRawFormat;
  customColorIndexRef: ValueRef<number>;
  materials: StringKeyDictionary<NoitaMaterial>;
  materialImageCache: StringKeyDictionary<CanvasRenderingContext2D>;
  materialColorCache: StringKeyDictionary<RgbaColor>;
}

export function renderChunkPixel({
  x,
  y,
  chunk,
  customColorIndexRef,
  materials,
  materialImageCache,
  materialColorCache,
}: Props): RgbaColor {
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

    const color: RgbaColor = {
      r: o4,
      g: o3,
      b: o2,
      a: o1,
    };

    return color;
  }

  const materialId = chunk.materialIds[cellData];
  if (materialId === 'air') {
    return colorHelpers.emptyColor;
  }

  if (materialId in materialColorCache) {
    return materialColorCache[materialId];
  }

  const material = materials[materialId];
  if (!material) {
    return colorHelpers.emptyColor;
  }

  if (material.hasGraphicsImage) {
    const ctx: CanvasRenderingContext2D = materialImageCache[materialId];

    const wx = (x + chunk.width) * 6;
    const wy = (y + chunk.height) * 6;

    const colorX = wx % ctx.canvas.width;
    const colorY = wy % ctx.canvas.height;

    const pixelData = ctx.getImageData(colorX, colorY, 1, 1).data;

    const color = {
      r: pixelData[0],
      g: pixelData[1],
      b: pixelData[2],
      a: pixelData[3],
    };

    materialColorCache[materialId] = color;

    return color;
  }

  const matColor = colorHelpers.conversion
    .fromArgbString(material.graphicsColor ?? material.wangColor)
    .toRgbaObj();

  materialColorCache[materialId] = matColor;

  return matColor;
}
