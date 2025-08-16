import { NoitaMaterial } from '@noita-explorer/model-noita';
import { publicPaths } from '../utils/public-paths.ts';
import { imageHelpers } from '@noita-explorer/tools';

export const getMaterialIconType = (
  material: NoitaMaterial,
): 'pouch' | 'potion' | undefined => {
  if (material.cellType === 'liquid' && !material.liquidSand) {
    return 'potion';
  } else if (material.cellType === 'liquid' && material.liquidSand) {
    return 'pouch';
  } else return;
};

export function renderMaterialPotion(
  material: NoitaMaterial,
  baseImage?: string,
) {
  baseImage ??= publicPaths.static.dataWak.misc('potion');
  const color = material.graphicsColor ?? material.wangColorHtml;

  return imageHelpers.renderMaterialContainer(baseImage, {
    color: color,
    mouthRowStart: 2,
    mouthRowEnd: 2,
  });
}

export function renderMaterialPouch(
  material: NoitaMaterial,
  baseImage?: string,
) {
  baseImage ??= publicPaths.static.dataWak.misc('material_pouch');
  const color = material.graphicsColor ?? material.wangColorHtml;

  return imageHelpers.renderMaterialContainer(baseImage, {
    color: color,
    mouthRowStart: 1,
    mouthRowEnd: 2,
  });
}
