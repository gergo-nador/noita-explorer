import {
  ActiveIconWrapper,
  Card,
  ProgressIcon,
} from '@noita-explorer/noita-component-library';
import { NoitaProgressIconTable } from '../../../components/noita-progress-icon-table.tsx';
import { NoitaEnemy } from '@noita-explorer/model-noita';
import { useMemo, useState } from 'react';
import { EnemyFilters } from './enemy-filters.ts';
import { EnemyFiltersView } from './enemy-filters-view.tsx';
import { arrayHelpers } from '@noita-explorer/tools';
import { Flex } from '@noita-explorer/react-utils';
import { Link, Outlet } from 'react-router-dom';
import { pages } from '../../../routes/pages.ts';
import { publicPaths } from '../../../utils/public-paths.ts';
import { useDataWakService } from '../../../services/data-wak/use-data-wak-service.ts';

export const WikiEnemies = () => {
  const { data } = useDataWakService();

  const enemies = useMemo(() => {
    return data.enemies.map((enemy) => {
      const gameEffects = collectAllProtectionsForEnemy(enemy);
      return { ...enemy, gameEffects };
    });
  }, [data.enemies]);

  const [filters, setFilters] = useState<EnemyFilters>({
    protectionId: undefined,
  });

  const usedProtectionIds = useMemo(() => {
    const gameEffects = enemies
      .map((e) => e.gameEffects)
      .flat()
      .map((effect) => effect.id);

    return arrayHelpers.unique(gameEffects);
  }, [enemies]);

  return (
    <Flex
      justify='center'
      gap={20}
      style={{
        margin: 'auto',
        maxHeight: '100%',
        overflowY: 'auto',
        padding: 15,
        boxSizing: 'border-box',
      }}
    >
      <aside
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
          count={data.enemies.length}
          name='Enemies'
          columnCount={9}
        >
          {enemies?.map((enemy) => (
            <EnemyProgressIcon key={enemy.id} enemy={enemy} filters={filters} />
          ))}
        </NoitaProgressIconTable>
      </aside>

      <Card
        style={{
          width: '50%',
          maxWidth: '500px',
          maxHeight: '100%',
          position: 'sticky',
          top: 0,
        }}
      >
        <Outlet />
      </Card>
    </Flex>
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

const EnemyProgressIcon = ({
  enemy,
  filters,
}: {
  enemy: NoitaEnemy;
  filters: EnemyFilters;
}) => {
  const filter = evaluateFiltersForEnemy({ enemy, filters });
  const icon = (
    <ProgressIcon
      type='regular'
      icon={publicPaths.generated.enemy.image({ enemyId: enemy.id })}
    />
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
        <Link to={pages.wiki.enemyDetail(enemy.id)}>
          <ActiveIconWrapper
            id={'enemy-' + enemy.id}
            key={'enemy-' + enemy.id}
            tooltip={
              <div>
                <div style={{ fontSize: 20 }}>{enemy.name}</div>
              </div>
            }
            style={{ cursor: 'pointer' }}
          >
            {icon}
          </ActiveIconWrapper>
        </Link>
      )}
    </div>
  );
};

const collectAllProtectionsForEnemy = (enemy: NoitaEnemy) => {
  const gameEffects = [...enemy.gameEffects];

  if (
    enemy.fireProbabilityOfIgnition === 0 &&
    gameEffects.every((e) => e.id !== 'PROTECTION_FIRE')
  ) {
    gameEffects.push({
      id: 'PROTECTION_FIRE',
      frames: -1,
    });
  }

  if (enemy.airNeeded === false) {
    gameEffects.push({
      id: 'PROTECTION_SUFFOCATE',
      frames: -1,
    });
  }

  if (enemy.tags.includes('polymorphable_NOT')) {
    gameEffects.push({
      id: 'PROTECTION_POLYMORPH',
      frames: -1,
    });
  }

  if (enemy.tags.includes('necrobot_NOT')) {
    gameEffects.push({
      id: 'PROTECTION_RESURRECTION',
      frames: -1,
    });
  }

  if (enemy.tags.includes('glue_NOT')) {
    gameEffects.push({
      id: 'PROTECTION_GLUE',
      frames: -1,
    });
  }

  if (enemy.tags.includes('touchmagic_immunity')) {
    gameEffects.push({
      id: 'PROTECTION_TOUCH_MAGIC',
      frames: -1,
    });
  }

  if (enemy.physicsObjectsDamage === false) {
    gameEffects.push({
      id: 'PROTECTION_PHYSICS_IMPACT',
      frames: -1,
    });
  }

  // make the protection all be the first in the list
  gameEffects.sort((e1, e2) => {
    if (e1.id === 'PROTECTION_ALL') {
      return -1;
    }
    if (e2.id === 'PROTECTION_ALL') {
      return 1;
    }
    return 0;
  });

  return gameEffects;
};
