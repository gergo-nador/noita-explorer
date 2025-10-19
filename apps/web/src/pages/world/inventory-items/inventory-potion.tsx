import {
  NoitaInventoryPotionItem,
  NoitaPotionMaterial,
} from '@noita-explorer/model-noita';
import {
  InventoryIcon,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import { NoitaPotionCard } from '../../../components/noita-potion-card.tsx';
import { useEffect, useState } from 'react';
import { renderMaterialPouch } from '../../../noita/noita-materials.ts';
import { publicPaths } from '../../../utils/public-paths.ts';
import { arrayHelpers } from '@noita-explorer/tools';
import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';

interface Props {
  item: NoitaInventoryPotionItem;
}

export const InventoryPotion = ({ item }: Props) => {
  const { lookup } = useNoitaDataWakStore();
  const [potionIcon, setPotionIcon] = useState(
    publicPaths.static.dataWak.misc('potion'),
  );

  useEffect(() => {
    if (!lookup?.materials) return;

    const potionMaterial = arrayHelpers.maxBy(
      item.item.materials,
      (material: NoitaPotionMaterial) => material.usage,
    );

    const materialId = potionMaterial.item?.materialId;
    if (!materialId) return;

    const material = lookup.materials[materialId];
    if (!material) return;

    renderMaterialPouch(
      material,
      publicPaths.static.dataWak.misc('potion'),
    ).then((image) => setPotionIcon(image));
  }, [lookup?.materials, item.item.materials]);

  return (
    <NoitaTooltipWrapper
      content={<NoitaPotionCard potion={item.item} withoutCardBorder />}
    >
      <InventoryIcon icon={potionIcon} size={50} useOriginalIconSize />
    </NoitaTooltipWrapper>
  );
};
