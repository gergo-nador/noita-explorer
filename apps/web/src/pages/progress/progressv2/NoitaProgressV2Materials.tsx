import { useNoitaDataWakStore } from '../../../stores/NoitaDataWak.ts';
import { NoitaMaterialIcon } from '../../../components/NoitaMaterialIcon.tsx';
import { NoitaProgressIconTable } from '../../../components/NoitaProgressIconTable.tsx';
import { ActiveIconWrapper } from '@noita-explorer/noita-component-library';

export const NoitaProgressV2Materials = () => {
  const { data } = useNoitaDataWakStore();

  if (!data?.materials) {
    return <div>Noita Data Wak is not loaded.</div>;
  }

  return (
    <div>
      <div>potion:</div>
      <div>
        <NoitaProgressIconTable
          count={data.materials.length}
          name={'Materials'}
          columnCount={9}
        >
          {data.materials.map((material) => (
            <ActiveIconWrapper
              id={'enemy-' + material.id}
              key={'enemy-' + material.id}
              tooltip={
                <div>
                  <div style={{ fontSize: 20 }}>{material.name}</div>
                  <div style={{ fontSize: 20 }}>{material.id}</div>
                </div>
              }
            >
              <NoitaMaterialIcon material={material} />
            </ActiveIconWrapper>
          ))}
        </NoitaProgressIconTable>

        {/*<img src={potionPng} style={{ zoom: 4, imageRendering: 'pixelated' }} />
        <img src={img} style={{ zoom: 4, imageRendering: 'pixelated' }} />*/}
      </div>
    </div>
  );
};
