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

export const NoitaProgressV2Enemies = () => {
  const { data } = useNoitaDataWakStore();
  const [selectedEnemy, setSelectedEnemy] =
    useStateWithQueryParamsString<NoitaEnemy>({
      key: 'enemy',
      queryParamValueSelector: (enemy) => enemy.id,
      findValueBasedOnQueryParam: (enemyId) =>
        data?.enemies?.find((enemy) => enemy.id === enemyId),
    });

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
        <NoitaProgressIconTable
          count={data.spells.length}
          name={'Spells'}
          columnCount={9}
        >
          {data.enemies.map((enemy) => (
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
        {!selectedEnemy && <span>Select an enemy</span>}
        {selectedEnemy && <EnemyOverview enemy={selectedEnemy} />}
      </Card>
    </div>
  );
};
