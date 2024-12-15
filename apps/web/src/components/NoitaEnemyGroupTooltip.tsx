import {
  EnemyStatistic,
  NoitaEnemyGroup,
  StringKeyDictionary,
} from '@noita-explorer/model';

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
    <div style={{ maxWidth: '400px' }}>
      <div style={{ fontSize: 20 }}>{enemyGroup.name}</div>
      {enemyGroup.enemies.map((e) => (
        <div>
          {enemyGroup.enemies.length > 1 && <div>{e.id}</div>}

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
