import { useMemo } from 'react';
import { StringKeyDictionary } from '@noita-explorer/model';
import {
  EnemyStatistic,
  NoitaEnemy,
  NoitaEnemyGroup,
} from '@noita-explorer/model-noita';
import { publicPaths } from '../utils/public-paths.ts';

interface useNoitaEnemyGroupsProps {
  enemies?: NoitaEnemy[];
  enemyStatistics?: StringKeyDictionary<EnemyStatistic>;
}

export const useNoitaEnemyGroups = ({
  enemies,
  enemyStatistics,
}: useNoitaEnemyGroupsProps) => {
  return useMemo(() => {
    if (enemies === undefined) return undefined;

    const groups: StringKeyDictionary<{
      enemyGroup: NoitaEnemyGroup;
      statistics: StringKeyDictionary<EnemyStatistic>;
    }> = {};

    enemies.forEach((enemy, i) => {
      // Remove '_left' or '_right' postfix if present
      const baseId = enemy.id.replace(/(_left|_right)$/, '');

      if (!(baseId in groups)) {
        groups[baseId] = {
          enemyGroup: {
            baseId: baseId,
            name: enemy.name,
            index: i,
            imagePath: publicPaths.generated.enemy.image({
              enemyId: enemy.id,
            }),
            enemies: [],
          },
          statistics: {},
        };
      }

      groups[baseId].enemyGroup.enemies.push(enemy);

      if (enemyStatistics && enemy.id in enemyStatistics) {
        groups[baseId].statistics[enemy.id] = enemyStatistics[enemy.id];
      }
    });

    const values = Object.values(groups);
    values.sort((v1, v2) => v1.enemyGroup.index - v2.enemyGroup.index);
    return values;
  }, [enemies, enemyStatistics]);
};
