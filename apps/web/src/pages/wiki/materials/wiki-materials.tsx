import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';
import { NoitaMaterialIcon } from '../../../components/NoitaMaterialIcon.tsx';
import { NoitaProgressIconTable } from '../../../components/NoitaProgressIconTable.tsx';
import {
  ActiveIconWrapper,
  Card,
} from '@noita-explorer/noita-component-library';
import { useMemo, useState } from 'react';
import { arrayHelpers } from '@noita-explorer/tools';
import { useStateWithQueryParamsString } from '../../../hooks/use-state-with-query-params-string.ts';
import { NoitaMaterial } from '@noita-explorer/model-noita';
import { MaterialOverview } from './material-overview.tsx';
import { MaterialFilters } from './material-filters.ts';
import { MaterialFiltersView } from './material-filters-view.tsx';

export const WikiMaterials = () => {
  const { data } = useNoitaDataWakStore();

  const [filters, setFilters] = useState<MaterialFilters>({
    tag: undefined,
  });

  const materialsUnique = useMemo(() => {
    if (!data?.materials) {
      return [];
    }

    const uniqueMaterials = arrayHelpers.uniqueBy(data.materials, (m) => m.id);
    uniqueMaterials.sort((a, b) => a.name.localeCompare(b.name));
    return uniqueMaterials;
  }, [data?.materials]);

  const [selectedMaterial, setSelectedMaterial] =
    useStateWithQueryParamsString<NoitaMaterial>({
      key: 'material',
      queryParamValueSelector: (material) => material.id,
      findValueBasedOnQueryParam: (materialId) =>
        materialsUnique.find((material) => material.id === materialId),
    });

  const allAvailableTags = useMemo(() => {
    const allTags = materialsUnique.map((m) => m.tags).flat();
    const allUniqueTags = arrayHelpers.unique(allTags);
    allUniqueTags.sort((t1, t2) => t1.localeCompare(t2));
    return allUniqueTags;
  }, [materialsUnique]);

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
        <MaterialFiltersView
          setFilters={setFilters}
          filters={filters}
          allAvailableTags={allAvailableTags}
        />
        <br />
        <NoitaProgressIconTable
          count={materialsUnique.length}
          name={'Materials'}
          columnCount={9}
          iconGap={4}
        >
          {materialsUnique.map((material) => {
            const filter = evaluateFiltersOnMaterials({ material, filters });

            const icon = <NoitaMaterialIcon material={material} />;

            return (
              <div
                key={material.id}
                style={{
                  opacity: filter ? 1 : 0.35,
                }}
              >
                {!filter && icon}
                {filter && (
                  <ActiveIconWrapper
                    id={'material-' + material.id}
                    key={'material-' + material.id}
                    onClick={() => setSelectedMaterial(material)}
                    tooltip={
                      <div>
                        <div style={{ fontSize: 20 }}>{material.name}</div>
                      </div>
                    }
                  >
                    {icon}
                  </ActiveIconWrapper>
                )}
              </div>
            );
          })}
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
        {selectedMaterial && (
          <MaterialOverview
            key={selectedMaterial.id}
            material={selectedMaterial}
          />
        )}
      </Card>
    </div>
  );
};

const evaluateFiltersOnMaterials = ({
  material,
  filters,
}: {
  material: NoitaMaterial;
  filters: MaterialFilters;
}) => {
  if (filters.tag) {
    if (!material.tags.some((t) => t === filters.tag)) {
      return false;
    }
  }

  return true;
};
