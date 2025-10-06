import { NoitaMaterial } from '@noita-explorer/model-noita';
import { NoitaMaterialIcon } from '../../../components/noita-material-icon.tsx';
import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';
import { useMemo } from 'react';
import { Flex } from '@noita-explorer/react-utils';
import { BooleanIcon } from '@noita-explorer/noita-component-library';

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
        <Flex
          align='center'
          style={{
            fontSize: 20,
            marginBottom: 10,
            textTransform: 'capitalize',
          }}
        >
          {material.name}
        </Flex>
      </div>
      <table style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th></th>
            <th style={{ width: '70%' }}></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Id</td>
            <td>{material.id}</td>
          </tr>
          <tr>
            <td>Cell type</td>
            <td>{material.cellType}</td>
          </tr>
          <tr>
            <td>Durability</td>
            <td>{material.durability}</td>
          </tr>
          <tr>
            <td>Hardness</td>
            <td>{material.hardness ?? '-'}</td>
          </tr>
          <tr>
            <td>Burnable</td>
            <td>
              <BooleanIcon value={material.burnable} />
            </td>
          </tr>
          <tr>
            <td>Electrical Conductivity</td>
            <td>
              <BooleanIcon value={material.electricalConductivity} />
            </td>
          </tr>
          <tr>
            <td>Stickiness</td>
            <td>{material.stickiness ?? '-'}</td>
          </tr>
          <tr>
            <td>Stains</td>
            <td>
              {material.stainEffects.length === 0
                ? '-'
                : material.stainEffects
                    .map((stain) => stain.effectType)
                    .join(', ')}
            </td>
          </tr>
          <tr>
            <td>Tags</td>
            <td>{material.tags.join(', ')}</td>
          </tr>
        </tbody>
      </table>

      <div>Reactions {reactions.length}</div>
    </div>
  );
};
