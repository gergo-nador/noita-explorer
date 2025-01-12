import {
  ActiveIconWrapper,
  Card,
  Icon,
  NoitaTooltipWrapper,
  ProgressIcon,
} from '@noita-explorer/noita-component-library';
import { NoitaProgressIconTable } from '../../../components/NoitaProgressIconTable.tsx';
import { useNoitaDataWakStore } from '../../../stores/NoitaDataWak.ts';
import { useMemo, useState } from 'react';
import { NoitaEnemy } from '@noita-explorer/model-noita';
import { Flex } from '../../../components/Flex.tsx';
import { NoitaProtections } from '../../../noita/NoitaProtections.ts';
import { useNoitaUnits } from '../../../hooks/useNoitaUnits.ts';

export const NoitaProgressV2Enemies = () => {
  const { data } = useNoitaDataWakStore();
  const [selectedEnemy, setSelectedEnemy] = useState<NoitaEnemy>();

  if (!data) {
    return <div>Noita Data Wak is not loaded.</div>;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '6fr 6fr',
        gap: 20,
        maxWidth: '1220px', // 500px left panel + 20px gap + 500px right panel
        margin: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '700px',
          minWidth: '200px',
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
      <div>
        <Card style={{ position: 'sticky', top: 0 }}>
          {!selectedEnemy && <span>Select an enemy</span>}
          {selectedEnemy && <EnemyOverview enemy={selectedEnemy} />}
        </Card>
      </div>
    </div>
  );
};

const EnemyOverview = ({ enemy }: { enemy: NoitaEnemy }) => {
  const noitaUnits = useNoitaUnits();

  const gameEffects = useMemo(() => {
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

    if (enemy.entityTags.includes('polymorphable_NOT')) {
      gameEffects.push({
        id: 'PROTECTION_POLYMORPH',
        frames: -1,
      });
    }

    if (enemy.entityTags.includes('necrobot_NOT')) {
      gameEffects.push({
        id: 'PROTECTION_RESURRECTION',
        frames: -1,
      });
    }

    if (enemy.entityTags.includes('glue_NOT')) {
      gameEffects.push({
        id: 'PROTECTION_GLUE',
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
  }, [enemy]);

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '15% 1fr',
          width: '100%',
          gap: 5,
        }}
      >
        <Icon
          type={'custom'}
          src={enemy.imageBase64}
          style={{ aspectRatio: 1, width: '100%' }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            paddingLeft: 10,
          }}
        >
          <div style={{ fontSize: 30, marginBottom: 5 }}>{enemy.name}</div>
          <div>{enemy.id}</div>
        </div>
      </div>

      <br />
      <div>{enemy.entityTags.join(', ')}</div>
      <br />
      <div>Hp: {enemy.hp}</div>
      <div>Max Hp: {enemy.maxHp}</div>
      {enemy.hp !== undefined && (
        <div>Gold: {enemy.goldDrop ? enemy.goldDrop : '-'}</div>
      )}
      <br />
      <div>Bleeds: {enemy.bloodMaterial}</div>
      <div>Corpse: {enemy.ragdollMaterial}</div>
      <div>Predator: {enemy.genomeData?.isPredator ? 'Yes' : 'No'}</div>
      <div>{enemy.knockBackResistance}</div>

      <br />
      <div style={{ width: 'max-content' }}>
        <Flex style={{ width: 'max-content' }}>
          {gameEffects
            .filter((gameEffect) => gameEffect.id in NoitaProtections)
            .map((gameEffect) => (
              <NoitaTooltipWrapper
                key={gameEffect.id}
                content={
                  <div>
                    <div style={{ fontSize: 18 }}>
                      {NoitaProtections[gameEffect.id].name}
                    </div>
                    {gameEffect.frames !== -1 && (
                      <div style={{ textAlign: 'center' }}>
                        (For{' '}
                        {noitaUnits.frames(
                          gameEffect.frames,
                          noitaUnits.frameDefaultUnits.gameEffectTime,
                        )}
                        )
                      </div>
                    )}
                  </div>
                }
              >
                <Icon
                  type={'custom'}
                  src={NoitaProtections[gameEffect.id].image}
                  size={50}
                />
              </NoitaTooltipWrapper>
            ))}
        </Flex>
      </div>

      <br />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
        <div style={{ gridColumnStart: 1, gridColumnEnd: -1 }}>
          <div>projectile:</div>
          {enemy.damageMultipliers.projectile}
        </div>
        <div>
          <div>explosion:</div>
          {enemy.damageMultipliers.explosion}
        </div>
        <div>
          <div>melee:</div>
          {enemy.damageMultipliers.melee}
        </div>
        <div>
          <div>slice:</div>
          {enemy.damageMultipliers.slice}
        </div>
        <div>
          <div>fire:</div>
          {enemy.damageMultipliers.fire}
        </div>
        <div>
          <div>electric:</div>
          {enemy.damageMultipliers.electricity}
        </div>
        <div>
          <div>ice:</div>
          {enemy.damageMultipliers.ice}
        </div>
        <div>
          <div>radioactive:</div>
          {enemy.damageMultipliers.radioactive}
        </div>
        <div>
          <div>drill:</div>
          {enemy.damageMultipliers.drill}
        </div>
        <div>
          <div>holy:</div>
          {enemy.damageMultipliers.holy}
        </div>
      </div>

      <br />

      <div>
        Variants:
        {enemy.variants.map((v) => (
          <div>
            {v.variantId}: {v.enemy.hp}
          </div>
        ))}
      </div>
    </div>
  );
};
