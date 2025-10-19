import { NoitaPotion, NoitaPotionMaterial } from '@noita-explorer/model-noita';
import { XmlWrapperType } from '@noita-explorer/tools/xml';
import { hasEntityTag } from './tags.ts';
import { arrayHelpers } from '@noita-explorer/tools';

export const scrapePotion = ({
  xml,
}: {
  xml: XmlWrapperType;
}): NoitaPotion | undefined => {
  if (!xml) return;
  if (!hasEntityTag(xml, 'potion')) return;

  const materialSuckerComponent = xml.findNthTag('MaterialSuckerComponent');
  if (!materialSuckerComponent) return;

  const potion: NoitaPotion = {
    materials: [],
    maxCapacity: materialSuckerComponent
      .getRequiredAttribute('barrel_size')
      .asInt(),
    usedCapacity: 0,
  };

  const materialInventoryComponent = xml.findNthTag(
    'MaterialInventoryComponent',
  );
  if (!materialInventoryComponent) return potion;

  const countPerMaterialType = materialInventoryComponent.findNthTag(
    'count_per_material_type',
  );
  if (!countPerMaterialType) return potion;

  const materials = countPerMaterialType.findTagArray('Material');
  if (materials.length === 0) return potion;

  potion.materials = materials.map(
    (materialEntity): NoitaPotionMaterial => ({
      materialId: materialEntity.getRequiredAttribute('material').asText(),
      usage: materialEntity.getRequiredAttribute('count').asInt(),
    }),
  );

  potion.usedCapacity = arrayHelpers.sumBy(potion.materials, 'usage');

  return potion;
};
