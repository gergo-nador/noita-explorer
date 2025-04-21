import {
  ActiveIconWrapper,
  Card,
  ProgressIcon,
} from '@noita-explorer/noita-component-library';
import { NoitaProgressIconTable } from '../../../../components/NoitaProgressIconTable.tsx';
import { useNoitaDataWakStore } from '../../../../stores/NoitaDataWak.ts';
import { NoitaEnemy } from '@noita-explorer/model-noita';
import { useStateWithQueryParamsString } from '../../../../hooks/use-state-with-query-params-string.ts';
import { EnemyOverview } from './enemy-overview.tsx';
import { useMemo, useState } from 'react';
import { EnemyFilters } from './enemy-filters.ts';
import { EnemyFiltersView } from './enemy-filters-view.tsx';
import { arrayHelpers } from '@noita-explorer/tools';

export const NoitaProgressV2Enemies = () => {
  const { data } = useNoitaDataWakStore();
  const [selectedEnemy, setSelectedEnemy] =
    useStateWithQueryParamsString<NoitaEnemy>({
      key: 'enemy',
      queryParamValueSelector: (enemy) => enemy.id,
      findValueBasedOnQueryParam: (enemyId) =>
        data?.enemies?.find((enemy) => enemy.id === enemyId),
    });

  const [filters, setFilters] = useState<EnemyFilters>({
    protectionId: undefined,
  });

  const usedProtectionIds = useMemo(() => {
    if (data?.enemies === undefined) {
      return [];
    }

    const gameEffects = data.enemies
      .map((e) => e.gameEffects)
      .flat()
      .map((effect) => effect.id);

    return arrayHelpers.unique(gameEffects);
  }, [data?.enemies]);

  if (!data) {
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
          position: 'relative',
        }}
      >
        <EnemyFiltersView
          filters={filters}
          setFilters={setFilters}
          usedProtectionIds={usedProtectionIds}
        />
        <br />
        <NoitaProgressIconTable
          count={data.spells.length}
          name={'Spells'}
          columnCount={9}
        >
          {data.enemies.map((enemy) => {
            const filter = evaluateFiltersForEnemy({ enemy, filters });
            const icon = (
              <ProgressIcon type={'regular'} icon={enemy.imageBase64} />
            );

            return (
              <div
                key={enemy.id}
                style={{
                  opacity: filter ? 1 : 0.35,
                }}
              >
                {!filter && icon}
                {filter && (
                  <ActiveIconWrapper
                    id={'enemy-' + enemy.id}
                    key={'enemy-' + enemy.id}
                    tooltip={
                      <div>
                        <div style={{ fontSize: 20 }}>{enemy.name}</div>
                      </div>
                    }
                    onClick={() => setSelectedEnemy(enemy)}
                  >
                    <ProgressIcon type={'regular'} icon={enemy.imageBase64} />
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
        {!selectedEnemy && <span>Select an enemy</span>}
        {selectedEnemy && <EnemyOverview enemy={selectedEnemy} />}
      </Card>
    </div>
  );
};

const evaluateFiltersForEnemy = ({
  enemy,
  filters,
}: {
  enemy: NoitaEnemy;
  filters: EnemyFilters;
}) => {
  if (filters.protectionId) {
    if (!enemy.gameEffects.find((e) => e.id === filters.protectionId)) {
      return false;
    }
  }

  return true;
};
