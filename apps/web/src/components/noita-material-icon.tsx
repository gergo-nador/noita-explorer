import { NoitaMaterial } from '@noita-explorer/model-noita';
import { InventoryIcon } from '@noita-explorer/noita-component-library';
import { publicPaths } from '../utils/public-paths.ts';
import { getMaterialIconType } from '../noita/noita-materials.ts';

interface NoitaMaterialIconProps {
  material: NoitaMaterial;
}

export const NoitaMaterialIcon = ({ material }: NoitaMaterialIconProps) => {
  const materialContainmentType = getMaterialIconType(material);
  if (materialContainmentType) {
    return (
      <InventoryIcon
        icon={publicPaths.generated.material.image({
          materialId: material.id,
          type: materialContainmentType,
        })}
      />
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
