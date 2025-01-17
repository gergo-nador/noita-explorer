import {
  NoitaSpell,
  NoitaWandSpell,
  SpellModifierNumberUnit,
} from '@noita-explorer/model-noita';
import { Icon } from '@noita-explorer/noita-component-library';
import { NoitaSpellTypesDictionary } from '../../noita/NoitaSpellTypeDictionary.ts';
import { BooleanIcon } from '../BooleanIcon.tsx';
import { Flex } from '../Flex.tsx';
import { switchStatement } from '@noita-explorer/tools';
import { useNoitaUnits } from '../../hooks/useNoitaUnits.ts';
import React from 'react';

import actionTypeIcon from '../../assets/icons/spells/icon_action_type.png';
import maxUsesIcon from '../../assets/icons/spells/icon_action_max_uses.png';
import manaDrainIcon from '../../assets/icons/spells/icon_mana_drain.png';
import lifetimeIcon from '../../assets/icons/spells/lifetime.webp';
import recoilModifierIcon from '../../assets/icons/spells/icon_recoil.png';
import fireRateWaitModifierIcon from '../../assets/icons/spells/icon_fire_rate_wait.png';
import reloadModifierIcon from '../../assets/icons/spells/icon_reload_time.png';
import speedModifierIcon from '../../assets/icons/spells/icon_speed_multiplier.png';
import spreadModifierIcon from '../../assets/icons/spells/icon_spread_degrees.png';

import damageProjectileIcon from '../../assets/icons/damages/icon_damage_projectile.png';
import damageExplosionIcon from '../../assets/icons/damages/icon_damage_explosion.png';
import explosionRadiusIcon from '../../assets/icons/spells/icon_explosion_radius.png';
import damageHealingIcon from '../../assets/icons/damages/icon_damage_healing.png';
import damageSliceIcon from '../../assets/icons/damages/icon_damage_slice.png';
import damageMeleeIcon from '../../assets/icons/damages/icon_damage_melee.png';
import damageFireIcon from '../../assets/icons/damages/icon_damage_fire.png';
import damageElectricityIcon from '../../assets/icons/damages/icon_damage_electricity.png';
import damageDrillIcon from '../../assets/icons/damages/icon_damage_drill.png';
import damageIceIcon from '../../assets/icons/damages/icon_damage_ice.png';
import damageHolyIcon from '../../assets/icons/damages/icon_damage_holy.png';

interface TooltipRowData {
  icon?: React.ReactNode;
  text: string;
  value: string | React.ReactNode;
  show?: boolean;
}

interface NoitaSpellTooltipProps {
  spell: NoitaSpell;
  wandSpell?: NoitaWandSpell;
  isUnknown?: boolean;
  warnings?: {
    manaTooMuch: boolean;
  };
}

export const NoitaSpellTooltip = ({
  spell,
  wandSpell,
  isUnknown,
  warnings,
}: NoitaSpellTooltipProps) => {
  const actionType = NoitaSpellTypesDictionary[spell.type];
  const noitaUnits = useNoitaUnits();

  if (isUnknown) {
    return <div>???</div>;
  }

  const rowsGeneral: TooltipRowData[] = [
    {
      icon: <Icon type={'custom'} src={actionTypeIcon} size={15} />,
      text: 'Type',
      value: actionType.name,
      show: true,
    },
    {
      icon: <Icon type={'custom'} src={manaDrainIcon} size={15} />,
      text: 'Mana Drain',
      value: (
        <span style={{ color: warnings?.manaTooMuch ? '#e35d5d' : 'inherit' }}>
          {spell.manaDrain}
          {warnings?.manaTooMuch && (
            <Icon type={'warning'} size={20} style={{ marginLeft: 5 }} />
          )}
        </span>
      ),
      show: true,
    },
    {
      icon: <Icon type={'custom'} src={maxUsesIcon} size={15} />,
      text: 'Uses',
      value: spell.maxUses,
      show:
        spell.maxUses !== undefined && wandSpell?.usesRemaining === undefined,
    },
    {
      icon: <Icon type={'custom'} src={maxUsesIcon} size={15} />,
      text: 'Uses remaining',
      value: wandSpell?.usesRemaining,
      show: wandSpell?.usesRemaining !== undefined,
    },
    {
      text: 'Flag Required',
      value: spell.spawnRequiredFlag,
      show: spell.spawnRequiredFlag !== undefined,
    },
    {
      text: 'Friendly Fire',
      value: <BooleanIcon value={spell.friendlyFire} />,
      show: spell.friendlyFire,
    },
  ];

  const rowsTime: TooltipRowData[] = [
    {
      icon: <Icon type={'custom'} src={lifetimeIcon} size={15} />,
      text: 'Lifetime',
      value: (() => {
        if (spell.lifetime === undefined) {
          return '';
        }

        if (
          spell.lifetimeRandomness !== undefined &&
          spell.lifetimeRandomness !== 0
        ) {
          const minLifetime = spell.lifetime - spell.lifetimeRandomness;
          const minLifetimeText = noitaUnits.framesWithoutUnit(
            minLifetime,
            noitaUnits.frameDefaultUnits.lifetime,
          );

          const maxLifetime = spell.lifetime + spell.lifetimeRandomness;
          const maxLifetimeText = noitaUnits.frames(
            maxLifetime,
            noitaUnits.frameDefaultUnits.lifetime,
          );

          return `${minLifetimeText}-${maxLifetimeText}`;
        }

        return noitaUnits.frames(
          spell.lifetime,
          noitaUnits.frameDefaultUnits.lifetime,
        );
      })(),

      show: spell.lifetime !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={lifetimeIcon} size={15} />,
      text: 'Lifetime Modifier',
      value: (
        <NumberModifierDisplay
          modifier={spell.lifetimeModifier}
          unitDisplayCallback={(value) =>
            noitaUnits.frames(value, noitaUnits.frameDefaultUnits.lifetime)
          }
        />
      ),
      show: spell.lifetimeModifier !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={fireRateWaitModifierIcon} size={15} />,
      text: 'Cast Delay',
      value: (
        <NumberModifierDisplay
          modifier={spell.fireRateWaitModifier}
          unitDisplayCallback={(value) =>
            noitaUnits.frames(value, noitaUnits.frameDefaultUnits.fireRateWait)
          }
        />
      ),
      show: spell.fireRateWaitModifier !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={reloadModifierIcon} size={15} />,
      text: 'Reload Time',
      value: (
        <NumberModifierDisplay
          modifier={spell.reloadTimeModifier}
          unitDisplayCallback={(value) =>
            noitaUnits.frames(value, noitaUnits.frameDefaultUnits.reloadTime)
          }
        />
      ),
      show: spell.reloadTimeModifier !== undefined,
    },
  ];

  const rowsDamages: TooltipRowData[] = [
    {
      icon: <Icon type={'custom'} src={damageProjectileIcon} size={15} />,
      text: 'Projectile Damage',
      value: spell.projectileDamage,
      show: spell.projectileDamage !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={damageProjectileIcon} size={15} />,
      text: 'Projectile Damage',
      value: (
        <NumberModifierDisplay modifier={spell.projectileDamageModifier} />
      ),
      show: spell.projectileDamageModifier !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={damageExplosionIcon} size={15} />,
      text: 'Explosion Damage',
      value: spell.explosionDamage,
      show: spell.explosionDamage !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={damageExplosionIcon} size={15} />,
      text: 'Explosion Damage',
      value: <NumberModifierDisplay modifier={spell.explosionDamageModifier} />,
      show: spell.explosionDamageModifier !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={explosionRadiusIcon} size={15} />,
      text: 'Explosion Radius',
      value: spell.explosionRadius,
      show: spell.explosionRadius !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={explosionRadiusIcon} size={15} />,
      text: 'Explosion Radius',
      value: <NumberModifierDisplay modifier={spell.explosionRadiusModifier} />,
      show: spell.explosionRadiusModifier !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={damageSliceIcon} size={15} />,
      text: 'Slice Damage',
      value: spell.sliceDamage,
      show: spell.sliceDamage !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={damageMeleeIcon} size={15} />,
      text: 'Melee Damage',
      value: spell.meleeDamage,
      show: spell.meleeDamage !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={damageFireIcon} size={15} />,
      text: 'Fire Damage',
      value: spell.fireDamage,
      show: spell.fireDamage !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={damageHealingIcon} size={15} />,
      text: 'Healing Damage',
      value: spell.healingDamage,
      show: spell.healingDamage !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={damageHealingIcon} size={15} />,
      text: 'Regeneration Time',
      value: spell.regenerationFrames,
      show: spell.regenerationFrames !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={damageElectricityIcon} size={15} />,
      text: 'Electricity Damage',
      value: spell.electricityDamage,
      show: spell.electricityDamage !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={damageDrillIcon} size={15} />,
      text: 'Drill Damage',
      value: spell.drillDamage,
      show: spell.drillDamage !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={damageIceIcon} size={15} />,
      text: 'Ice Damage',
      value: spell.iceDamage,
      show: spell.iceDamage !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={damageIceIcon} size={15} />,
      text: 'Ice Damage',
      value: <NumberModifierDisplay modifier={spell.iceDamageModifier} />,
      show: spell.iceDamageModifier !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={damageHolyIcon} size={15} />,
      text: 'Holy Damage',
      value: spell.holyDamage,
      show: spell.holyDamage !== undefined,
    },
  ];

  const rowsOther: TooltipRowData[] = [
    {
      icon: <Icon type={'custom'} src={speedModifierIcon} size={15} />,
      text: 'Speed modifier',
      value: <NumberModifierDisplay modifier={spell.speedModifier} />,
      show: spell.speedModifier !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={recoilModifierIcon} size={15} />,
      text: 'Recoil',
      value: <NumberModifierDisplay modifier={spell.recoilModifier} />,
      show: spell.recoilModifier !== undefined,
    },
    {
      icon: <Icon type={'custom'} src={spreadModifierIcon} size={15} />,
      text: 'Spread',
      value: (
        <NumberModifierDisplay
          modifier={spell.spreadDegreesModifier}
          unitDisplayCallback={noitaUnits.degree}
        />
      ),
      show: spell.spreadDegreesModifier !== undefined,
    },
  ];

  return (
    <div style={{ minWidth: '350px', maxWidth: '450px', lineHeight: '16px' }}>
      <div>
        <div style={{ fontSize: 20, marginBottom: 10 }}>
          {spell.name}
          {wandSpell?.usesRemaining !== undefined &&
            wandSpell.usesRemaining !== -1 && (
              <span> ( {wandSpell.usesRemaining} )</span>
            )}
        </div>
        <div>{spell.description}</div>
        <br />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
          }}
        >
          <table style={{ width: '100%' }}>
            <tbody>
              {rowsGeneral
                .filter((r) => r.show)
                .map((r) => (
                  <tr key={r.text + r.value}>
                    <td>{r.icon}</td>
                    <td>{r.text}</td>
                    <td>{r.value}</td>
                  </tr>
                ))}

              {rowsTime.some((r) => r.show) && (
                <tr>
                  <td colSpan={3} style={{ height: 10 }}></td>
                </tr>
              )}

              {rowsTime
                .filter((r) => r.show)
                .map((r) => (
                  <tr key={r.text + r.value}>
                    <td>{r.icon}</td>
                    <td>{r.text}</td>
                    <td>{r.value}</td>
                  </tr>
                ))}

              {rowsDamages.some((r) => r.show) && (
                <tr>
                  <td colSpan={3} style={{ height: 10 }}></td>
                </tr>
              )}

              {rowsDamages
                .filter((r) => r.show)
                .map((r) => (
                  <tr key={r.text + r.value}>
                    <td>{r.icon}</td>
                    <td>{r.text}</td>
                    <td>{r.value}</td>
                  </tr>
                ))}

              {rowsOther.some((r) => r.show) && (
                <tr>
                  <td colSpan={3} style={{ height: 10 }}></td>
                </tr>
              )}

              {rowsOther
                .filter((r) => r.show)
                .map((r) => (
                  <tr key={r.text + r.value}>
                    <td>{r.icon}</td>
                    <td>{r.text}</td>
                    <td>{r.value}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Flex
            style={{
              alignItems: 'center',
            }}
          >
            <Icon type={'custom'} src={spell.imageBase64} size={74} />
          </Flex>
        </div>
      </div>
    </div>
  );
};

const NumberModifierDisplay = ({
  modifier,
  unitDisplayCallback,
}: {
  modifier: SpellModifierNumberUnit | undefined;
  unitDisplayCallback?: (value: number) => string;
}) => {
  if (modifier === undefined) {
    return <div></div>;
  }

  const operator: string | undefined = switchStatement(modifier.operator).cases(
    {
      '*': 'x',
      __default: modifier.operator,
    },
  );

  return (
    <div>
      {operator}
      {unitDisplayCallback !== undefined
        ? unitDisplayCallback(modifier.value)
        : modifier?.value}
    </div>
  );
};
