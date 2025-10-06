import { useMemo } from 'react';
import {
  NoitaMaterial,
  NoitaMaterialReactionComponent,
} from '@noita-explorer/model-noita';
import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';

interface Props {
  material: NoitaMaterial;
}

export const useMaterialReactions = ({ material }: Props) => {
  const { data } = useNoitaDataWakStore();

  const reactions = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.materialReactions.filter((reaction) => {
      const isComponentTheMaterial = (
        material: NoitaMaterial,
        reactionComponent: NoitaMaterialReactionComponent,
      ): boolean => {
        if (material.id === reactionComponent.componentId) return true;

        const isTag = /^\[.*\]$/.test(reactionComponent.componentId);
        if (!isTag) return false;

        return material.tags.includes(reactionComponent.componentId);
      };

      const isInputReaction = reaction.inputComponents.some((component) =>
        isComponentTheMaterial(material, component),
      );

      if (isInputReaction) {
        return true;
      }

      const isOutputReaction = reaction.outputComponents.some((component) =>
        isComponentTheMaterial(material, component),
      );

      return isOutputReaction;
    });
  }, [data, material]);

  return { reactions };
};
