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

import damageProjectileIcon from '../../../assets/icons/damages/icon_damage_projectile.png';
import damageProjectileIconColor from '../../../assets/icons/damages/icon_damage_projectile_color.png';
import damageExplosionIcon from '../../../assets/icons/damages/icon_damage_explosion.png';
import damageExplosionIconColor from '../../../assets/icons/damages/icon_damage_explosion_color.png';
import damageMeleeIcon from '../../../assets/icons/damages/icon_damage_melee.png';
import damageMeleeIconColor from '../../../assets/icons/damages/icon_damage_melee_color.png';
import damageSliceIcon from '../../../assets/icons/damages/icon_damage_slice.png';
import damageSliceIconColor from '../../../assets/icons/damages/icon_damage_slice_color.png';
import damageFireIcon from '../../../assets/icons/damages/icon_damage_fire.png';
import damageFireIconColor from '../../../assets/icons/damages/icon_damage_fire_color.png';
import damageElectricityIcon from '../../../assets/icons/damages/icon_damage_electricity.png';
import damageElectricityIconColor from '../../../assets/icons/damages/icon_damage_electricity_color.png';
import damageIceIcon from '../../../assets/icons/damages/icon_damage_ice.png';
import damageIceIconColor from '../../../assets/icons/damages/icon_damage_ice_color.png';
import damageRadioActivityIcon from '../../../assets/icons/damages/icon_damage_radioactivity.png';
import damageRadioActivityIconColor from '../../../assets/icons/damages/icon_damage_radioactivity_color.png';
import damageDrillIcon from '../../../assets/icons/damages/icon_damage_drill.png';
import damageDrillIconColor from '../../../assets/icons/damages/icon_damage_drill_color.png';
import damageHolyIcon from '../../../assets/icons/damages/icon_damage_holy.png';
import damageHolyIconColor from '../../../assets/icons/damages/icon_damage_holy_color.png';

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

    if (enemy.entityTags.includes('touchmagic_immunity')) {
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
      <div>
        <Flex style={{ flexWrap: 'wrap' }}>
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
          <DamageMultiplierDisplay
            name={'projectile'}
            icon={damageProjectileIcon}
            iconColor={damageProjectileIconColor}
            value={enemy.damageMultipliers.projectile}
          />
        </div>
        <div>
          <DamageMultiplierDisplay
            name={'explosion'}
            icon={damageExplosionIcon}
            iconColor={damageExplosionIconColor}
            value={enemy.damageMultipliers.explosion}
          />
        </div>
        <div>
          <DamageMultiplierDisplay
            name={'melee'}
            icon={damageMeleeIcon}
            iconColor={damageMeleeIconColor}
            value={enemy.damageMultipliers.melee}
          />
        </div>
        <div>
          <DamageMultiplierDisplay
            name={'slice'}
            icon={damageSliceIcon}
            iconColor={damageSliceIconColor}
            value={enemy.damageMultipliers.slice}
          />
        </div>
        <div>
          <DamageMultiplierDisplay
            name={'fire'}
            icon={damageFireIcon}
            iconColor={damageFireIconColor}
            value={enemy.damageMultipliers.fire}
          />
        </div>
        <div>
          <DamageMultiplierDisplay
            name={'electric'}
            icon={damageElectricityIcon}
            iconColor={damageElectricityIconColor}
            value={enemy.damageMultipliers.electricity}
          />
        </div>
        <div>
          <DamageMultiplierDisplay
            name={'ice'}
            icon={damageIceIcon}
            iconColor={damageIceIconColor}
            value={enemy.damageMultipliers.ice}
          />
        </div>
        <div>
          <DamageMultiplierDisplay
            name={'toxic'}
            icon={damageRadioActivityIcon}
            iconColor={damageRadioActivityIconColor}
            value={enemy.damageMultipliers.radioactive}
          />
        </div>
        <div>
          <DamageMultiplierDisplay
            name={'drill'}
            icon={damageDrillIcon}
            iconColor={damageDrillIconColor}
            value={enemy.damageMultipliers.drill}
          />
        </div>
        <div>
          <DamageMultiplierDisplay
            name={'holy'}
            icon={damageHolyIcon}
            iconColor={damageHolyIconColor}
            value={enemy.damageMultipliers.holy}
          />
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

interface DamageMultiplierDisplayProps {
  name: string;
  icon: string;
  iconColor: string;
  value: number;
}
const DamageMultiplierDisplay = ({
  name,
  icon,
  iconColor,
  value,
}: DamageMultiplierDisplayProps) => {
  let color = 'inherit';
  if (value === 0) color = '#FFAABB';
  else if (value < 0) color = '#EE8866';
  else if (value < 1) color = '#EEDD88';
  else if (value > 1) color = '#44BB99';

  // the icons are 7x7, 21 is divisible by 7, so the icons
  // will look natural
  const iconSize = 21;

  return (
    <div>
      <NoitaTooltipWrapper content={name}>
        <div style={{ width: 'fit-content' }}>
          {value === 1 && <Icon type={'custom'} src={icon} size={iconSize} />}
          {value !== 1 && (
            <Icon type={'custom'} src={iconColor} size={iconSize} />
          )}
          <span style={{ color: color }}> {value}</span>
        </div>
      </NoitaTooltipWrapper>
    </div>
  );
};
