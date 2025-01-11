import {
  ActiveIconWrapper,
  Card,
  ProgressIcon,
} from '@noita-explorer/noita-component-library';
import { NoitaProgressIconTable } from '../../../components/NoitaProgressIconTable.tsx';
import { useNoitaDataWakStore } from '../../../stores/NoitaDataWak.ts';
import { useState } from 'react';
import { NoitaEnemy } from '@noita-explorer/model-noita';
import { mathHelpers } from '@noita-explorer/tools';

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
        <Card>
          {!selectedEnemy && <span>Select an enemy</span>}
          {selectedEnemy && <EnemyOverview enemy={selectedEnemy} />}
        </Card>
      </div>
    </div>
  );
};

const EnemyOverview = ({ enemy }: { enemy: NoitaEnemy }) => {
  const calculateGold = (hp: number) => {
    // based on data\scripts\items\drop_money.lua

    let originalHp = hp / 25;
    if (originalHp > 1) {
      originalHp = mathHelpers.floor(originalHp);
    }

    const gold = originalHp * 10;
    return Math.max(gold, 10);
  };
  return (
    <div>
      <div>{enemy.name}</div>
      <div>{enemy.id}</div>
      <br />
      <div>Hp: {enemy.hp}</div>
      <div>Max Hp: {enemy.maxHp}</div>
      {enemy.hp !== undefined && (
        <div>Gold: {enemy.goldDrop ? calculateGold(enemy.hp) : '-'}</div>
      )}
      <br />
      <div>Bleeds: {enemy.bloodMaterial}</div>
      <div>Corpse: {enemy.ragdollMaterial}</div>
      <div>Predator: {enemy.genomeData?.isPredator ? 'Yes' : 'No'}</div>
      <div>{enemy.knockBackResistance}</div>

      <div>
        Game Effects:{' '}
        {enemy.gameEffects.map((effect) => (
          <div>{effect.id}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
        <div style={{ gridColumnStart: 1, gridColumnEnd: -1 }}>
          <div>projectile:</div> {enemy.damageMultipliers.projectile}
        </div>
        <div>
          <div>explosion:</div> {enemy.damageMultipliers.explosion}
        </div>
        <div>
          <div>melee:</div> {enemy.damageMultipliers.melee}
        </div>
        <div>
          <div>slice:</div> {enemy.damageMultipliers.slice}
        </div>
        <div>
          <div>fire:</div> {enemy.damageMultipliers.fire}
        </div>
        <div>
          <div>electric:</div> {enemy.damageMultipliers.electricity}
        </div>
        <div>
          <div>ice:</div> {enemy.damageMultipliers.ice}
        </div>
        <div>
          <div>radioactive:</div> {enemy.damageMultipliers.radioactive}
        </div>
        <div>
          <div>drill:</div> {enemy.damageMultipliers.drill}
        </div>
        <div>
          <div>holy:</div> {enemy.damageMultipliers.holy}
        </div>
      </div>

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
