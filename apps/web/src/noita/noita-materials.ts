import { NoitaMaterial } from '@noita-explorer/model-noita';
import { publicPaths } from '../utils/public-paths.ts';
import { imageHelpers } from '@noita-explorer/tools';

type MaterialContainerType = 'pouch' | 'potion';

export const getMaterialIconType = ({
  material,
  forcePotion,
}: {
  material: NoitaMaterial;
  forcePotion?: boolean;
}): MaterialContainerType | undefined => {
  if (material.cellType !== 'liquid') return;

  if (forcePotion) return 'potion';
  return material.liquidSand ? 'pouch' : 'potion';
};

export const getMaterialAllContainerTypes = (
  material: NoitaMaterial,
): MaterialContainerType[] => {
  const arr: MaterialContainerType[] = [];

  if (material.cellType === 'liquid') {
    arr.push('potion');
  }
  if (material.cellType === 'liquid' && material.liquidSand) {
    arr.push('pouch');
  }

  return arr;
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
