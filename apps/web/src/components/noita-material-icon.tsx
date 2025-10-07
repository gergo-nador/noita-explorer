import { NoitaMaterial } from '@noita-explorer/model-noita';
import {
  InventoryIcon,
  PixelatedImage,
} from '@noita-explorer/noita-component-library';
import { publicPaths } from '../utils/public-paths.ts';
import { getMaterialIconType } from '../noita/noita-materials.ts';

interface NoitaMaterialIconProps {
  material: NoitaMaterial;
  hasInventoryIcon?: boolean;
  forcePotion?: boolean;
}

export const NoitaMaterialIcon = ({
  material,
  hasInventoryIcon,
  forcePotion,
}: NoitaMaterialIconProps) => {
  const materialContainmentType = getMaterialIconType({
    material,
    forcePotion,
  });
  if (materialContainmentType) {
    const imagePath = publicPaths.generated.material.image({
      materialId: material.id,
      type: materialContainmentType,
    });

    return hasInventoryIcon ? (
      <InventoryIcon icon={imagePath} />
    ) : (
      <PixelatedImage src={imagePath} />
    );
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
