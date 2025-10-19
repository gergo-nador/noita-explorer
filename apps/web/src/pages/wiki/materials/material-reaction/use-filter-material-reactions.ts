import { useCallback, useMemo } from 'react';
import {
  NoitaMaterial,
  NoitaMaterialReaction,
  NoitaMaterialReactionComponent,
} from '@noita-explorer/model-noita';
import { useNoitaDataWakStore } from '../../../../stores/noita-data-wak.ts';
import { parseReactionMaterial } from './material-reaction.utils.ts';

interface Props {
  material: NoitaMaterial;
}

export const useFilterMaterialReactions = ({ material }: Props) => {
  const { data, lookup } = useNoitaDataWakStore();

  /**
   * Returns if a matterial matches the reaction component
   * @param material
   * @param reactionComponent
   */
  const isComponentTheMaterial = useCallback(
    (
      material: NoitaMaterial,
      reactionComponent: NoitaMaterialReactionComponent,
    ): boolean => {
      const reactionMaterial = parseReactionMaterial(
        reactionComponent.componentId,
      );
      const materialId = material.id;
      // if material id matches
      if (reactionMaterial.type === 'material-id') {
        return reactionMaterial.id === materialId;
      }

      if (reactionMaterial.type !== 'material-tag') return false;

      // check if the material has the current tag
      if (!reactionMaterial.extension) {
        return material.tags.includes(reactionMaterial.tag);
      }

      // from now on, check whether the source element has the tag
      if (!materialId.endsWith(reactionMaterial.extension)) {
        return false;
      }

      const sourceMaterialId = materialId.substring(
        0,
        materialId.length - reactionMaterial.extension.length - 1, // -1 to remove the last underscore
      );
      const sourceMaterial = lookup?.materials?.[sourceMaterialId];
      if (!sourceMaterial) return false;

      return sourceMaterial.tags.includes(reactionMaterial.tag);
    },
    [lookup?.materials],
  );

  const reactions = useMemo(() => {
    if (!data) {
      return;
    }

    const sourceReactions: NoitaMaterialReaction[] = [];
    const productReactions: NoitaMaterialReaction[] = [];
    const persistentReactions: NoitaMaterialReaction[] = [];

    for (const reaction of data.materialReactions) {
      const isInputReaction = reaction.inputComponents.some((component) =>
        isComponentTheMaterial(material, component),
      );
      const isOutputReaction = reaction.outputComponents.some((component) =>
        isComponentTheMaterial(material, component),
      );

      if (isInputReaction && isOutputReaction) {
        persistentReactions.push(reaction);
      } else if (isInputReaction) {
        sourceReactions.push(reaction);
      } else if (isOutputReaction) {
        productReactions.push(reaction);
      }
    }

    return { sourceReactions, productReactions, persistentReactions };
  }, [data, isComponentTheMaterial, material]);

  return { reactions };
};
