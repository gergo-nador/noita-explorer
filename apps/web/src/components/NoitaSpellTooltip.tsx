import { NoitaSpell } from '@noita-explorer/model';
import { Icon } from '@noita-explorer/noita-component-library';

import actionTypeIcon from '../assets/icons/spells/icon_action_type.png';
import maxUsesIcon from '../assets/icons/spells/icon_action_max_uses.png';
import manaDrainIcon from '../assets/icons/spells/icon_mana_drain.png';
import lifetimeIcon from '../assets/icons/spells/lifetime.webp';
import recoilModifierIcon from '../assets/icons/spells/icon_recoil.png';
import fireRateWaitModifierIcon from '../assets/icons/spells/icon_fire_rate_wait.png';
import reloadModifierIcon from '../assets/icons/spells/icon_reload_time.png';
import speedModifierIcon from '../assets/icons/spells/icon_speed_multiplier.png';
import spreadModifierIcon from '../assets/icons/spells/icon_spread_degrees.png';

import damageProjectileIcon from '../assets/icons/spells/icon_damage_projectile.png';
import damageExplosionIcon from '../assets/icons/spells/icon_damage_explosion.png';
import explosionRadiusIcon from '../assets/icons/spells/icon_explosion_radius.png';
import damageHealingIcon from '../assets/icons/spells/icon_damage_healing.png';
import damageSliceIcon from '../assets/icons/spells/icon_damage_slice.png';
import damageMeleeIcon from '../assets/icons/spells/icon_damage_melee.png';
import damageFireIcon from '../assets/icons/spells/icon_damage_fire.png';
import damageElectricityIcon from '../assets/icons/spells/icon_damage_electricity.png';
import damageDrillIcon from '../assets/icons/spells/icon_damage_drill.png';
import damageIceIcon from '../assets/icons/spells/icon_damage_ice.png';
import damageHolyIcon from '../assets/icons/spells/icon_damage_holy.png';
import { NoitaSpellTypesDictionary } from '../noita/NoitaSpellTypeDictionary.ts';

interface NoitaSpellInfoTableProps {
  spell: NoitaSpell;
  isUnknown?: boolean;
}

export const NoitaSpellTooltip = ({
  spell,
  isUnknown,
}: NoitaSpellInfoTableProps) => {
  const actionType = NoitaSpellTypesDictionary[spell.type];

  if (isUnknown) {
    return <div>???</div>;
  }

  return (
    <div style={{ minWidth: '350px', maxWidth: '400px' }}>
      <div style={{ fontSize: 20, marginBottom: 10 }}>{spell.name}</div>
      <div>{spell.description}</div>
      <br />
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td>
              <Icon type={'custom'} src={actionTypeIcon} size={15} />
            </td>
            <td>Type</td>
            <td style={{ textAlign: 'right', wordBreak: 'keep-all' }}>
              {actionType.name}
            </td>
          </tr>
          <tr>
            <td>
              <Icon type={'custom'} src={manaDrainIcon} size={15} />
            </td>
            <td>Mana Drain</td>
            <td style={{ textAlign: 'right' }}>{spell.manaDrain}</td>
          </tr>
          {spell.maxUses && (
            <tr>
              <td>
                <Icon type={'custom'} src={maxUsesIcon} size={15} />
              </td>
              <td>Uses</td>
              <td style={{ textAlign: 'right' }}>{spell.maxUses}</td>
            </tr>
          )}
          {spell.spawnRequiredFlag && (
            <tr>
              <td>
                {/*<Icon type={'custom'} src={manaDrainIcon} size={15} />*/}
              </td>
              <td>Flag Required</td>
              <td style={{ textAlign: 'right' }}>{spell.spawnRequiredFlag}</td>
            </tr>
          )}
          <tr>
            <td>
              {/*<Icon type={'custom'} src={manaDrainIcon} size={15} />*/}
            </td>
            <td>Friendly Fire</td>
            <td style={{ textAlign: 'right' }}>
              {spell.friendlyFire ? 'Yes' : 'No'}
            </td>
          </tr>

          <tr>
            <td colSpan={3}>
              <hr />
            </td>
          </tr>

          {spell.lifetime !== undefined && (
            <tr>
              <td>
                <Icon type={'custom'} src={lifetimeIcon} size={15} />
              </td>
              <td>Lifetime</td>
              <td style={{ textAlign: 'right' }}>
                {spell.lifetimeRandomness !== undefined &&
                spell.lifetimeRandomness !== 0
                  ? `${spell.lifetime - spell.lifetimeRandomness}-${spell.lifetime + spell.lifetimeRandomness}`
                  : spell.lifetime}
              </td>
            </tr>
          )}
          {spell.lifetimeModifier && (
            <tr>
              <td>
                <Icon type={'custom'} src={lifetimeIcon} size={15} />
              </td>
              <td>Lifetime Modifier</td>
              <td style={{ textAlign: 'right' }}>
                {spell.lifetimeModifier.operator}
                {spell.lifetimeModifier.value}
              </td>
            </tr>
          )}
          {spell.fireRateWaitModifier && (
            <tr>
              <td>
                <Icon
                  type={'custom'}
                  src={fireRateWaitModifierIcon}
                  size={15}
                />
              </td>
              <td>Cast Delay</td>
              <td style={{ textAlign: 'right' }}>
                {spell.fireRateWaitModifier.operator}
                {spell.fireRateWaitModifier.value}
              </td>
            </tr>
          )}
          {spell.reloadTimeModifier && (
            <tr>
              <td>
                <Icon type={'custom'} src={reloadModifierIcon} size={15} />
              </td>
              <td>Reload Time</td>
              <td style={{ textAlign: 'right' }}>
                {spell.reloadTimeModifier.operator}
                {spell.reloadTimeModifier.value}
              </td>
            </tr>
          )}

          <tr>
            <td colSpan={3}>
              <hr />
            </td>
          </tr>

          {spell.projectileDamage !== undefined &&
            spell.projectileDamage > 0 && (
              <tr>
                <td>
                  <Icon type={'custom'} src={damageProjectileIcon} size={15} />
                </td>
                <td>Projectile Damage</td>
                <td style={{ textAlign: 'right' }}>{spell.projectileDamage}</td>
              </tr>
            )}
          {spell.projectileDamageModifier && (
            <tr>
              <td>
                <Icon type={'custom'} src={damageProjectileIcon} size={15} />
              </td>
              <td>Projectile Damage</td>
              <td style={{ textAlign: 'right' }}>
                {spell.projectileDamageModifier.operator}
                {spell.projectileDamageModifier.value}
              </td>
            </tr>
          )}
          {spell.explosionDamage !== undefined && spell.explosionDamage > 0 && (
            <tr>
              <td>
                <Icon type={'custom'} src={damageExplosionIcon} size={15} />
              </td>
              <td>Explosion Damage</td>
              <td style={{ textAlign: 'right' }}>{spell.explosionDamage}</td>
            </tr>
          )}
          {spell.explosionDamageModifier && (
            <tr>
              <td>
                <Icon type={'custom'} src={damageExplosionIcon} size={15} />
              </td>
              <td>Explosion Damage</td>
              <td style={{ textAlign: 'right' }}>
                {spell.explosionDamageModifier.operator}
                {spell.explosionDamageModifier.value}
              </td>
            </tr>
          )}
          {spell.explosionRadius !== undefined && spell.explosionRadius > 0 && (
            <tr>
              <td>
                <Icon type={'custom'} src={explosionRadiusIcon} size={15} />
              </td>
              <td>Explosion Radius</td>
              <td style={{ textAlign: 'right' }}>{spell.explosionRadius}</td>
            </tr>
          )}
          {spell.explosionRadiusModifier && (
            <tr>
              <td>
                <Icon type={'custom'} src={explosionRadiusIcon} size={15} />
              </td>
              <td>Explosion Radius</td>
              <td style={{ textAlign: 'right' }}>
                {spell.explosionRadiusModifier.operator}
                {spell.explosionRadiusModifier.value}
              </td>
            </tr>
          )}
          {spell.sliceDamage !== undefined && (
            <tr>
              <td>
                <Icon type={'custom'} src={damageSliceIcon} size={15} />
              </td>
              <td>Slice Damage</td>
              <td style={{ textAlign: 'right' }}>{spell.sliceDamage}</td>
            </tr>
          )}
          {spell.meleeDamage !== undefined && (
            <tr>
              <td>
                <Icon type={'custom'} src={damageMeleeIcon} size={15} />
              </td>
              <td>Melee Damage</td>
              <td style={{ textAlign: 'right' }}>{spell.meleeDamage}</td>
            </tr>
          )}
          {spell.fireDamage !== undefined && (
            <tr>
              <td>
                <Icon type={'custom'} src={damageFireIcon} size={15} />
              </td>
              <td>Fire Damage</td>
              <td style={{ textAlign: 'right' }}>{spell.fireDamage}</td>
            </tr>
          )}
          {spell.healingDamage !== undefined && (
            <tr>
              <td>
                <Icon type={'custom'} src={damageHealingIcon} size={15} />
              </td>
              <td>Healing Damage</td>
              <td style={{ textAlign: 'right' }}>{spell.healingDamage}</td>
            </tr>
          )}
          {spell.regenerationFrames !== undefined && (
            <tr>
              <td>
                <Icon type={'custom'} src={damageHealingIcon} size={15} />
              </td>
              <td>Regeneration Time</td>
              <td style={{ textAlign: 'right' }}>{spell.regenerationFrames}</td>
            </tr>
          )}
          {spell.electricityDamage !== undefined && (
            <tr>
              <td>
                <Icon type={'custom'} src={damageElectricityIcon} size={15} />
              </td>
              <td>Electricity Damage</td>
              <td style={{ textAlign: 'right' }}>{spell.electricityDamage}</td>
            </tr>
          )}
          {spell.drillDamage !== undefined && (
            <tr>
              <td>
                <Icon type={'custom'} src={damageDrillIcon} size={15} />
              </td>
              <td>Drill Damage</td>
              <td style={{ textAlign: 'right' }}>{spell.drillDamage}</td>
            </tr>
          )}
          {spell.iceDamage !== undefined && (
            <tr>
              <td>
                <Icon type={'custom'} src={damageIceIcon} size={15} />
              </td>
              <td>Ice Damage</td>
              <td style={{ textAlign: 'right' }}>{spell.iceDamage}</td>
            </tr>
          )}
          {spell.iceDamageModifier && (
            <tr>
              <td>
                <Icon type={'custom'} src={damageIceIcon} size={15} />
              </td>
              <td>Ice Damage</td>
              <td style={{ textAlign: 'right' }}>
                {spell.iceDamageModifier.operator}
                {spell.iceDamageModifier.value}
              </td>
            </tr>
          )}
          {spell.holyDamage !== undefined && (
            <tr>
              <td>
                <Icon type={'custom'} src={damageHolyIcon} size={15} />
              </td>
              <td>Holy Damage</td>
              <td style={{ textAlign: 'right' }}>{spell.holyDamage}</td>
            </tr>
          )}

          <tr>
            <td colSpan={3}>
              <hr />
            </td>
          </tr>

          {spell.speedModifier && (
            <tr>
              <td>
                <Icon type={'custom'} src={speedModifierIcon} size={15} />
              </td>
              <td>Speed modifier</td>
              <td style={{ textAlign: 'right' }}>
                {spell.speedModifier.operator}
                {spell.speedModifier.value}
              </td>
            </tr>
          )}
          {spell.recoilModifier && (
            <tr>
              <td>
                <Icon type={'custom'} src={recoilModifierIcon} size={15} />
              </td>
              <td>Recoil</td>
              <td style={{ textAlign: 'right' }}>
                {spell.recoilModifier.operator}
                {spell.recoilModifier.value}
              </td>
            </tr>
          )}

          {spell.spreadDegreesModifier && (
            <tr>
              <td>
                <Icon type={'custom'} src={spreadModifierIcon} size={15} />
              </td>
              <td>Spread</td>
              <td style={{ textAlign: 'right' }}>
                {spell.spreadDegreesModifier.operator}
                {spell.spreadDegreesModifier.value}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
