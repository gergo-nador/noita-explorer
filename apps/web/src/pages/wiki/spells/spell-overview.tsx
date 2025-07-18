import { NoitaSpell } from '@noita-explorer/model-noita';
import { Icon, BooleanIcon } from '@noita-explorer/noita-component-library';
import { NoitaSpellTypesDictionary } from '../../../noita/noita-spell-type-dictionary.ts';
import { useNoitaUnits } from '../../../hooks/use-noita-units.ts';
import { TooltipRowData } from '../../../components/tooltips/noita-spell-tooltip.tsx';

import actionTypeIcon from '../../../assets/icons/spells/icon_action_type.png';
import manaDrainIcon from '../../../assets/icons/spells/icon_mana_drain.png';
import maxUsesIcon from '../../../assets/icons/spells/icon_action_max_uses.png';
import lifetimeIcon from '../../../assets/icons/spells/lifetime.webp';
import fireRateWaitModifierIcon from '../../../assets/icons/spells/icon_fire_rate_wait.png';
import reloadModifierIcon from '../../../assets/icons/spells/icon_reload_time.png';
import damageProjectileIcon from '../../../assets/icons/damages/icon_damage_projectile.png';
import damageExplosionIcon from '../../../assets/icons/damages/icon_damage_explosion.png';
import explosionRadiusIcon from '../../../assets/icons/spells/icon_explosion_radius.png';
import damageSliceIcon from '../../../assets/icons/damages/icon_damage_slice.png';
import damageMeleeIcon from '../../../assets/icons/damages/icon_damage_melee.png';
import damageFireIcon from '../../../assets/icons/damages/icon_damage_fire.png';
import damageHealingIcon from '../../../assets/icons/damages/icon_damage_healing.png';
import damageElectricityIcon from '../../../assets/icons/damages/icon_damage_electricity.png';
import damageDrillIcon from '../../../assets/icons/damages/icon_damage_drill.png';
import damageIceIcon from '../../../assets/icons/damages/icon_damage_ice.png';
import damageHolyIcon from '../../../assets/icons/damages/icon_damage_holy.png';
import speedModifierIcon from '../../../assets/icons/spells/icon_speed_multiplier.png';
import recoilModifierIcon from '../../../assets/icons/spells/icon_recoil.png';
import spreadModifierIcon from '../../../assets/icons/spells/icon_spread_degrees.png';
import { NoitaNumberModifier } from '../../../components/tooltips/noita-number-modifier.tsx';
import { Flex } from '@noita-explorer/react-utils';
import { CopyLinkText } from '../../../components/copy-link-text.tsx';
import { publicPaths } from '../../../utils/public-paths.ts';

export const SpellOverview = ({ spell }: { spell: NoitaSpell }) => {
  const actionType = NoitaSpellTypesDictionary[spell.type];
  const noitaUnits = useNoitaUnits();

  const rowsGeneral: TooltipRowData[] = [
    {
      icon: <Icon src={actionTypeIcon} size={15} />,
      text: 'Type',
      value: actionType.name,
      show: true,
    },
    {
      icon: <Icon src={manaDrainIcon} size={15} />,
      text: 'Mana Drain',
      value: <span>{spell.manaDrain}</span>,
      show: true,
    },
    {
      icon: <Icon src={maxUsesIcon} size={15} />,
      text: 'Uses',
      value: spell.maxUses,
      show: spell.maxUses !== undefined,
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
      icon: <Icon src={lifetimeIcon} size={15} />,
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
      icon: <Icon src={lifetimeIcon} size={15} />,
      text: 'Lifetime Modifier',
      value: (
        <NoitaNumberModifier
          modifier={spell.lifetimeModifier}
          unitDisplayCallback={(value) =>
            noitaUnits.frames(value, noitaUnits.frameDefaultUnits.lifetime)
          }
        />
      ),
      show: spell.lifetimeModifier !== undefined,
    },
    {
      icon: <Icon src={fireRateWaitModifierIcon} size={15} />,
      text: 'Cast Delay',
      value: (
        <NoitaNumberModifier
          modifier={spell.fireRateWaitModifier}
          unitDisplayCallback={(value) =>
            noitaUnits.frames(value, noitaUnits.frameDefaultUnits.fireRateWait)
          }
        />
      ),
      show: spell.fireRateWaitModifier !== undefined,
    },
    {
      icon: <Icon src={reloadModifierIcon} size={15} />,
      text: 'Reload Time',
      value: (
        <NoitaNumberModifier
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
      icon: <Icon src={damageProjectileIcon} size={15} />,
      text: 'Projectile Damage',
      value: spell.projectileDamage,
      show: spell.projectileDamage !== undefined,
    },
    {
      icon: <Icon src={damageProjectileIcon} size={15} />,
      text: 'Projectile Damage',
      value: <NoitaNumberModifier modifier={spell.projectileDamageModifier} />,
      show: spell.projectileDamageModifier !== undefined,
    },
    {
      icon: <Icon src={damageExplosionIcon} size={15} />,
      text: 'Explosion Damage',
      value: spell.explosionDamage,
      show: spell.explosionDamage !== undefined,
    },
    {
      icon: <Icon src={damageExplosionIcon} size={15} />,
      text: 'Explosion Damage',
      value: <NoitaNumberModifier modifier={spell.explosionDamageModifier} />,
      show: spell.explosionDamageModifier !== undefined,
    },
    {
      icon: <Icon src={explosionRadiusIcon} size={15} />,
      text: 'Explosion Radius',
      value: spell.explosionRadius,
      show: spell.explosionRadius !== undefined,
    },
    {
      icon: <Icon src={explosionRadiusIcon} size={15} />,
      text: 'Explosion Radius',
      value: <NoitaNumberModifier modifier={spell.explosionRadiusModifier} />,
      show: spell.explosionRadiusModifier !== undefined,
    },
    {
      icon: <Icon src={damageSliceIcon} size={15} />,
      text: 'Slice Damage',
      value: spell.sliceDamage,
      show: spell.sliceDamage !== undefined,
    },
    {
      icon: <Icon src={damageMeleeIcon} size={15} />,
      text: 'Melee Damage',
      value: spell.meleeDamage,
      show: spell.meleeDamage !== undefined,
    },
    {
      icon: <Icon src={damageFireIcon} size={15} />,
      text: 'Fire Damage',
      value: spell.fireDamage,
      show: spell.fireDamage !== undefined,
    },
    {
      icon: <Icon src={damageHealingIcon} size={15} />,
      text: 'Healing Damage',
      value: spell.healingDamage,
      show: spell.healingDamage !== undefined,
    },
    {
      icon: <Icon src={damageHealingIcon} size={15} />,
      text: 'Regeneration Time',
      value: spell.regenerationFrames,
      show: spell.regenerationFrames !== undefined,
    },
    {
      icon: <Icon src={damageElectricityIcon} size={15} />,
      text: 'Electricity Damage',
      value: spell.electricityDamage,
      show: spell.electricityDamage !== undefined,
    },
    {
      icon: <Icon src={damageDrillIcon} size={15} />,
      text: 'Drill Damage',
      value: spell.drillDamage,
      show: spell.drillDamage !== undefined,
    },
    {
      icon: <Icon src={damageIceIcon} size={15} />,
      text: 'Ice Damage',
      value: spell.iceDamage,
      show: spell.iceDamage !== undefined,
    },
    {
      icon: <Icon src={damageIceIcon} size={15} />,
      text: 'Ice Damage',
      value: <NoitaNumberModifier modifier={spell.iceDamageModifier} />,
      show: spell.iceDamageModifier !== undefined,
    },
    {
      icon: <Icon src={damageHolyIcon} size={15} />,
      text: 'Holy Damage',
      value: spell.holyDamage,
      show: spell.holyDamage !== undefined,
    },
  ];

  const rowsOther: TooltipRowData[] = [
    {
      icon: <Icon src={speedModifierIcon} size={15} />,
      text: 'Speed modifier',
      value: <NoitaNumberModifier modifier={spell.speedModifier} />,
      show: spell.speedModifier !== undefined,
    },
    {
      icon: <Icon src={recoilModifierIcon} size={15} />,
      text: 'Recoil',
      value: <NoitaNumberModifier modifier={spell.recoilModifier} />,
      show: spell.recoilModifier !== undefined,
    },
    {
      icon: <Icon src={spreadModifierIcon} size={15} />,
      text: 'Spread',
      value: (
        <NoitaNumberModifier
          modifier={spell.spreadDegreesModifier}
          unitDisplayCallback={noitaUnits.degree}
        />
      ),
      show: spell.spreadDegreesModifier !== undefined,
    },
  ];

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
        <Flex height='100%' align='center'>
          <Icon
            src={spell.imageBase64}
            style={{ aspectRatio: 1, width: '100%' }}
          />
        </Flex>

        <Flex justify='center' column>
          <CopyLinkText link={publicPaths.wiki.spells(spell.id)}>
            <div style={{ fontSize: 20, marginBottom: 10 }}>{spell.name}</div>
          </CopyLinkText>
          <div>{spell.description}</div>
        </Flex>
      </div>
      <br />
      <div>
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
      </div>
    </div>
  );
};
