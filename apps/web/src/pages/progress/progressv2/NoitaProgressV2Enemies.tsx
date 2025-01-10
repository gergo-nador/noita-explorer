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

    if (gold < 10) {
      return 0;
    }

    return gold;
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
      <div>Predator: {enemy.genomeData?.isPredator ? 'Yes' : 'No'}</div>
      <div>{enemy.knockBackResistance}</div>
      <div>
        Variants:
        {enemy.variants.map((v) => (
          <div>
            {v.biome}: {v.hp} {v.knockBackResistance}
          </div>
        ))}
      </div>
    </div>
  );
};
