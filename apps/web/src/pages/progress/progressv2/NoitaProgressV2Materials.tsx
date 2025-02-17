import { useNoitaDataWakStore } from '../../../stores/NoitaDataWak.ts';
import { NoitaMaterialIcon } from '../../../components/NoitaMaterialIcon.tsx';
import { NoitaProgressIconTable } from '../../../components/NoitaProgressIconTable.tsx';
import { ActiveIconWrapper } from '@noita-explorer/noita-component-library';
import { useMemo } from 'react';
import { arrayHelpers } from '@noita-explorer/tools';

export const NoitaProgressV2Materials = () => {
  const { data } = useNoitaDataWakStore();

  const materialsUnique = useMemo(() => {
    if (!data?.materials) {
      return [];
    }

    return arrayHelpers.uniqueBy(data.materials, (m) => m.id);
  }, [data?.materials]);

  if (!data?.materials) {
    return <div>Noita Data Wak is not loaded.</div>;
  }

  return (
    <div>
      <div>potion:</div>
      <div>
        <NoitaProgressIconTable
          count={materialsUnique.length}
          name={'Materials'}
          columnCount={9}
        >
          {materialsUnique.map((material) => (
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
      </div>
    </div>
  );
};
