import { NoitaPotion, NoitaPotionMaterial } from '@noita-explorer/model-noita';
import { Card } from '@noita-explorer/noita-component-library';
import { useNoitaDataWakStore } from '../stores/noita-data-wak.ts';
import { useMemo } from 'react';
import { ConditionalWrapper } from '@noita-explorer/react-utils';
import { sortHelpers } from '@noita-explorer/tools';

interface Props {
  potion: NoitaPotion;
  withoutCardBorder?: boolean;
}

export const NoitaPotionCard = ({ potion, withoutCardBorder }: Props) => {
  const { lookup } = useNoitaDataWakStore();
  const materials = useMemo(() => {
    if (!lookup?.materials) return [];

    const materials = [...potion.materials];
    materials.sort(
      sortHelpers.getPropertySorter<NoitaPotionMaterial>('usage', 'desc'),
    );

    return materials.map((potionMaterial) => ({
      potionMaterial,
      material: lookup.materials[potionMaterial.materialId],
    }));
  }, [potion.materials, lookup?.materials]);

  const mainMaterial = materials[0];

  const fillPercentage = (100 * potion.usedCapacity) / potion.maxCapacity;

  return (
    <ConditionalWrapper
      condition={!withoutCardBorder}
      wrapper={(children) => <Card>{children}</Card>}
    >
      <div style={{ marginBottom: 10 }}>
        <span style={{ textTransform: 'uppercase', fontSize: 16 }}>
          {mainMaterial?.material?.name} potion ( {fillPercentage}% full )
        </span>
      </div>
      <div>
        {materials.map((material) => {
          const fillPercentage =
            (100 * material.potionMaterial.usage) / potion.maxCapacity;

          return (
            <div style={{ textTransform: 'capitalize' }}>
              {fillPercentage}% {material.material?.name}
            </div>
          );
        })}
      </div>
    </ConditionalWrapper>
  );
};
