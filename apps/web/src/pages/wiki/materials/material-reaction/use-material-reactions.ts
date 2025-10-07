import { useMemo } from 'react';
import { NoitaMaterial } from '@noita-explorer/model-noita';
import { useNoitaDataWakStore } from '../../../../stores/noita-data-wak.ts';
import { isComponentTheMaterial } from './material-reaction.utils.ts';

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
