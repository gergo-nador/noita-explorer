import {
  ActiveIconWrapper,
  Card,
  ProgressIcon,
} from '@noita-explorer/noita-component-library';
import { NoitaProgressIconTable } from '../../../components/noita-progress-icon-table.tsx';
import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';
import { NoitaEnemy } from '@noita-explorer/model-noita';
import { useMemo, useState } from 'react';
import { EnemyFilters } from './enemy-filters.ts';
import { EnemyFiltersView } from './enemy-filters-view.tsx';
import { arrayHelpers } from '@noita-explorer/tools';
import { Flex } from '@noita-explorer/react-utils';
import { Link, Outlet, useParams } from 'react-router-dom';
import { pages } from '../../../routes/pages.ts';

export const WikiEnemies = () => {
  const { enemyId } = useParams();
  const { data } = useNoitaDataWakStore();

  const enemies = useMemo(() => {
    if (!data?.enemies) {
      return undefined;
    }

    return data.enemies.map((enemy) => {
      const gameEffects = collectAllProtectionsForEnemy(enemy);
      return { ...enemy, gameEffects };
    });
  }, [data?.enemies]);

  const [filters, setFilters] = useState<EnemyFilters>({
    protectionId: undefined,
  });

  const usedProtectionIds = useMemo(() => {
    if (enemies === undefined) {
      return [];
    }

    const gameEffects = enemies
      .map((e) => e.gameEffects)
      .flat()
      .map((effect) => effect.id);

    return arrayHelpers.unique(gameEffects);
  }, [enemies]);

  if (!data) {
    return <div>Noita Data Wak is not loaded.</div>;
  }

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
          count={data.enemies.length}
          name={'Enemies'}
          columnCount={9}
        >
          {enemies?.map((enemy) => (
            <EnemyProgressIcon key={enemy.id} enemy={enemy} filters={filters} />
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
        {!enemyId && <span>Select an enemy</span>}
        {enemyId && <Outlet />}
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
  const icon = <ProgressIcon type={'regular'} icon={enemy.imageBase64} />;

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
