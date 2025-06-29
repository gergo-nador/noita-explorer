import { StringKeyDictionary } from '@noita-explorer/model';
import { EnemyStatistic, NoitaEnemyGroup } from '@noita-explorer/model-noita';
import { BooleanIcon } from '../boolean-icon.tsx';
import { Flex } from '@noita-explorer/react-utils';
import { NoitaUnknownTooltip } from './noita-unknown-tooltip.tsx';

interface NoitaEnemyTooltipProps {
  enemyGroup: NoitaEnemyGroup;
  isUnknown?: boolean;
  statistics?: StringKeyDictionary<EnemyStatistic>;
}

export const NoitaEnemyGroupTooltip = ({
  enemyGroup,
  isUnknown,
  statistics,
}: NoitaEnemyTooltipProps) => {
  if (isUnknown) {
    return <NoitaUnknownTooltip />;
  }

  return (
    <div style={{ maxWidth: '400px', textAlign: 'right' }}>
      <div style={{ fontSize: 20 }}>{enemyGroup.name}</div>
      {statistics &&
        enemyGroup.enemies.map((e) => (
          <div style={{ fontSize: 16 }} key={e.id}>
            {enemyGroup.enemies.length > 1 && (
              <div style={{ marginTop: 10 }}>
                <Flex gap={5}>
                  <BooleanIcon value={e.id in statistics} />
                  <span>{e.id}</span>
                </Flex>
              </div>
            )}

            {statistics && e.id in statistics && (
              <div
                style={{
                  textAlign: 'right',
                  marginTop: enemyGroup.enemies.length === 1 ? 10 : 0,
                }}
              >
                <div>Kills: {statistics[e.id].enemyDeathByPlayer}</div>
                <div>Killed by: {statistics[e.id].playerDeathByEnemy}</div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};
