import {
  EnemyStatistic,
  NoitaEnemyGroup,
  StringKeyDictionary,
} from '@noita-explorer/model';
import { BooleanIcon } from '../BooleanIcon.tsx';
import { Flex } from '../Flex.tsx';

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
    return <div>???</div>;
  }

  return (
    <div style={{ maxWidth: '400px', textAlign: 'right' }}>
      <div style={{ fontSize: 20 }}>{enemyGroup.name}</div>
      {statistics &&
        enemyGroup.enemies.map((e) => (
          <div style={{ marginTop: 10, fontSize: 16 }}>
            {enemyGroup.enemies.length > 1 && (
              <div style={{ marginTop: 10 }}>
                <Flex gap={5}>
                  <BooleanIcon value={e.id in statistics} />
                  <span>{e.id}</span>
                </Flex>
              </div>
            )}
            {statistics && e.id in statistics && (
              <div>
                <div>Kills: {statistics[e.id].enemyDeathByPlayer}</div>
                <div>Killed by: {statistics[e.id].playerDeathByEnemy}</div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};
