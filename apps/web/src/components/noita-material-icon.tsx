import color from 'color';
import { NoitaMaterial } from '@noita-explorer/model-noita';
import { InventoryIcon } from '@noita-explorer/noita-component-library';
import { useEffect, useState } from 'react';
import { publicPaths } from '../utils/public-paths.ts';

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
      iconPromise = colorNoitaPotion({
        potionBaseImage: publicPaths.static.dataWak.misc('potion'),
        potionColor: material.graphicsColor ?? material.wangColorHtml,
        potionMouthRowStart: 2,
        potionMouthRowEnd: 2,
      });
    } else {
      iconPromise = colorNoitaPotion({
        potionBaseImage: publicPaths.static.dataWak.misc('material_pouch'),
        potionColor: material.graphicsColor ?? material.wangColorHtml,
        potionMouthRowStart: 1,
        potionMouthRowEnd: 2,
      });
    }

    iconPromise.then((icon) => {
      setMaterialIcon(icon);
      sessionStorage[iconCacheKey] = icon;
    });
  }, [material]);

  if (materialIcon) {
    return <InventoryIcon icon={materialIcon} />;
  }

  if (material.graphicsImageBase64) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${material.graphicsImageBase64})`,
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

function colorNoitaPotion({
  potionBaseImage,
  potionColor,
  potionMouthRowStart,
  potionMouthRowEnd,
}: {
  potionBaseImage: string;
  potionColor: string;
  potionMouthRowStart: number;
  potionMouthRowEnd: number;
}): Promise<string> {
  const [r, g, b] = color(potionColor).rgb().array();

  const potionColorMain = {
    r: r / 255,
    g: g / 255,
    b: b / 255,
    a: 1,
  };

  const potionFilter = {
    r: 0.85,
    g: 0.85,
    b: 0.85,
    a: 1,
  };

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (ctx == null) {
    throw new Error('Could not retrieve CanvasRenderingContext2D from canvas.');
  }

  const tex = new Image();
  tex.src = potionBaseImage;

  function applyColorFilter(imageData: ImageData) {
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const rowIndex = Math.floor(i / (canvas.width * 4));
      const isPotionMouthRow =
        rowIndex >= potionMouthRowStart && rowIndex <= potionMouthRowEnd;

      data[i] *= potionFilter.r;
      data[i + 1] *= potionFilter.g;
      data[i + 2] *= potionFilter.b;
      data[i + 3] *= potionFilter.a;

      if (!isPotionMouthRow) {
        data[i] *= potionColorMain.r;
        data[i + 1] *= potionColorMain.g;
        data[i + 2] *= potionColorMain.b;
        data[i + 3] *= potionColorMain.a;
      }
    }
    return imageData;
  }

  function renderPotion() {
    if (ctx == null) {
      throw new Error(
        'Could not retrieve CanvasRenderingContext2D from canvas.',
      );
    }

    ctx.drawImage(tex, 0, 0);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    imageData = applyColorFilter(imageData);

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
  }

  return new Promise((resolve, reject) => {
    try {
      tex.onload = () => {
        canvas.width = tex.width;
        canvas.height = tex.height;
        const base64 = renderPotion();
        resolve(base64);
      };
    } catch (e) {
      reject(e);
    }
  });
}
