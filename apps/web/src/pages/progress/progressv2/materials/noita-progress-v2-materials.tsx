import { useNoitaDataWakStore } from '../../../../stores/NoitaDataWak.ts';
import { NoitaMaterialIcon } from '../../../../components/NoitaMaterialIcon.tsx';
import { NoitaProgressIconTable } from '../../../../components/NoitaProgressIconTable.tsx';
import {
  ActiveIconWrapper,
  Card,
} from '@noita-explorer/noita-component-library';
import { useMemo } from 'react';
import { arrayHelpers } from '@noita-explorer/tools';
import { useStateWithQueryParamsString } from '../../../../hooks/use-state-with-query-params-string.ts';
import { NoitaMaterial } from '@noita-explorer/model-noita';

export const NoitaProgressV2Materials = () => {
  const { data } = useNoitaDataWakStore();

  const materialsUnique = useMemo(() => {
    if (!data?.materials) {
      return [];
    }

    return arrayHelpers.uniqueBy(data.materials, (m) => m.id);
  }, [data?.materials]);

  const [selectedMaterial, setSelectedMaterial] =
    useStateWithQueryParamsString<NoitaMaterial>({
      key: 'material',
      queryParamValueSelector: (material) => material.id,
      findValueBasedOnQueryParam: (materialId) =>
        materialsUnique.find((material) => material.id === materialId),
    });

  if (!data?.materials) {
    return <div>Noita Data Wak is not loaded.</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
        margin: 'auto',
        maxHeight: '100%',
        overflowY: 'auto',
        padding: 15,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          width: '50%',
        }}
      >
        {/*<PerkFiltersView
          setFilters={setFilters}
          filters={filters}
          showSave00RelatedFilters={unlockedPerks !== undefined}
          usedProtectionIds={usedProtectionIds}
        />*/}
        <br />
        <NoitaProgressIconTable
          count={materialsUnique.length}
          name={'Materials'}
          columnCount={9}
          iconGap={4}
        >
          {materialsUnique.map((material) => (
            <ActiveIconWrapper
              id={'material-' + material.id}
              key={'material-' + material.id}
              tooltip={
                <div>
                  <div style={{ fontSize: 20 }}>{material.name}</div>
                </div>
              }
              onClick={() => setSelectedMaterial(material)}
            >
              <NoitaMaterialIcon material={material} />
            </ActiveIconWrapper>
          ))}
        </NoitaProgressIconTable>
      </div>

      <Card
        style={{
          width: '50%',
          maxWidth: '500px',
          maxHeight: '100%',
          position: 'sticky',
          top: 0,
        }}
      >
        {!selectedMaterial && <span>Select a material</span>}
        {selectedMaterial && <div />}
      </Card>
    </div>
  );
};
