import { NoitaMaterial } from '@noita-explorer/model-noita';
import { InventoryIcon } from '@noita-explorer/noita-component-library';
import { useEffect, useState } from 'react';
import { publicPaths } from '../utils/public-paths.ts';
import {
  renderMaterialPotion,
  renderMaterialPouch,
} from '../noita/noita-materials.ts';

interface NoitaMaterialIconProps {
  material: NoitaMaterial;
}

export const NoitaMaterialIcon = ({ material }: NoitaMaterialIconProps) => {
  const [materialIcon, setMaterialIcon] = useState<string | undefined>(() => {
    const iconType = getMaterialIconType(material);

    if (!iconType) {
      return;
    }

    const iconCacheKey = getMaterialIconCacheKey(iconType, material.id);
    const materialCache = getMaterialIconFromCache(iconCacheKey);
    if (materialCache) {
      return materialCache;
    }
  });

  useEffect(() => {
    const iconType = getMaterialIconType(material);

    if (!iconType) {
      return;
    }

    const iconCacheKey = getMaterialIconCacheKey(iconType, material.id);
    const materialCache = getMaterialIconFromCache(iconCacheKey);
    if (materialCache) {
      setMaterialIcon(materialCache);
      return;
    }

    let iconPromise: Promise<string>;

    if (iconType === 'potion') {
      iconPromise = renderMaterialPotion(material);
    } else {
      iconPromise = renderMaterialPouch(material);
    }

    iconPromise.then((icon) => {
      setMaterialIcon(icon);
      sessionStorage[iconCacheKey] = icon;
    });
  }, [material]);

  if (materialIcon) {
    return <InventoryIcon icon={materialIcon} />;
  }

  if (material.hasGraphicsImage) {
    const path = publicPaths.generated.material.image({
      materialId: material.id,
    });
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${path})`,
          backgroundRepeat: 'repeat',
        }}
      ></div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: material.graphicsColor ?? material.wangColorHtml,
      }}
    ></div>
  );
};

const getMaterialIconType = (
  material: NoitaMaterial,
): 'pouch' | 'potion' | undefined => {
  if (material.cellType === 'liquid' && !material.liquidSand) {
    return 'potion';
  } else if (material.cellType === 'liquid' && material.liquidSand) {
    return 'pouch';
  } else return;
};

const getMaterialIconCacheKey = (iconType: string, materialId: string) =>
  `${iconType}-${materialId}`;

const getMaterialIconFromCache = (cacheId: string): string | undefined => {
  const cache = sessionStorage;

  if (cacheId in cache) {
    const icon = cache[cacheId];
    return icon;
  }
};
