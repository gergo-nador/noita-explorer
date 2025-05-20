import { NoitaMaterial } from '@noita-explorer/model-noita';
import { NoitaMaterialIcon } from '../../../components/noita-material-icon.tsx';
import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';
import { useMemo } from 'react';

interface Props {
  material: NoitaMaterial;
}

export const MaterialOverview = ({ material }: Props) => {
  const { data } = useNoitaDataWakStore();

  const reactions = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.materialReactions.filter((reaction) => {
      const isInputReaction = reaction.inputComponents.some(
        (i) => i.componentId === material.id,
      );

      if (isInputReaction) {
        return true;
      }

      const isOutputReaction = reaction.outputComponents.some(
        (o) => o.componentId === material.id,
      );

      return isOutputReaction;
    });
  }, [data, material]);

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '15% 1fr',
          width: '100%',
          gap: 5,
        }}
      >
        <div
          style={{
            height: '65px',
            width: '65px',
          }}
        >
          <NoitaMaterialIcon key={material.id} material={material} />
        </div>
        <div
          style={{
            fontSize: 20,
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {material.name}
        </div>
      </div>
      Tags
      <div>{material.tags.join(', ')}</div>
      Hardness
      <div>{material.hardness}</div>
      Cell type
      <div>{material.cellType}</div>
      Burnable
      <div>{material.burnable}</div>
      Durability
      <div>{material.durability}</div>
      Conductivity
      <div>{material.electricalConductivity}</div>
      Id
      <div>{material.id}</div>
      Stickiness
      <div>{material.stickiness}</div>
      Stains
      <div>{material.stainEffects.map((stain) => stain.effectType)}</div>
      Reactions
      <div>{reactions.length}</div>
    </div>
  );
};
