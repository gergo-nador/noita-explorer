import { NoitaEnemy } from '@noita-explorer/model-noita';
import { useNoitaUnits } from '../../../hooks/use-noita-units.ts';
import { useSettingsStore } from '../../../stores/settings.ts';
import {
  Header,
  Icon,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import heartIcon from '../../../assets/heart.png';
import goldNuggetIcon from '../../../assets/goldnugget_icon.png';
import { Flex } from '@noita-explorer/react-utils';
import { NoitaProtections } from '../../../noita/noita-protections.ts';
import { DamageMultiplierDisplay } from './damage-multiplier-display.tsx';

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

export const EnemyOverview = ({ enemy }: { enemy: NoitaEnemy }) => {
  const noitaUnits = useNoitaUnits();
  const { settings } = useSettingsStore();
  const { progressDisplayDebugData } = settings;

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
        <Flex
          justify='center'
          style={{
            flexDirection: 'column',
            paddingLeft: 10,
          }}
        >
          <div style={{ fontSize: 30 }}>{enemy.name}</div>
          {progressDisplayDebugData && (
            <div style={{ marginTop: 5 }}>{enemy.id}</div>
          )}
        </Flex>
      </div>

      <br />
      {progressDisplayDebugData && (
        <div>
          <Header title={'Debug'}>
            <div style={{ fontSize: 18 }}>Tags:</div>
            <div>{enemy.debug.entityTags.join(', ')}</div>
            <br />
            <div style={{ fontSize: 18 }}>Scraped Files:</div>
            <div>
              {enemy.debug.fileHierarchy.map((f) => (
                <div style={{ wordWrap: 'break-word', maxWidth: '100%' }}>
                  {f}
                </div>
              ))}
            </div>
            <br />
            <div style={{ fontSize: 18 }}>Additional Files:</div>
            <div>
              <div style={{ wordWrap: 'break-word', maxWidth: '100%' }}>
                {enemy.debug.imagePath}
              </div>
            </div>
            <br />
          </Header>
        </div>
      )}

      <div>
        Hp:<span style={{ color: '#f14343' }}> {enemy.hp} </span>
        <Icon type={'custom'} src={heartIcon} size={16} />
      </div>
      {enemy.maxHp !== undefined && (
        <div>
          Max Hp:<span style={{ color: '#f14343' }}> {enemy.maxHp} </span>
          <Icon type={'custom'} src={heartIcon} size={16} />
        </div>
      )}

      {enemy.hasGoldDrop && (
        <div>
          Gold:<span style={{ color: '#fae27e' }}> {enemy.goldDrop} </span>
          <Icon type={'custom'} src={goldNuggetIcon} size={16} />
        </div>
      )}
      {!enemy.hasGoldDrop && <div>Gold: -</div>}

      <br />
      <div>Bleeds: {enemy.bloodMaterial}</div>
      <div>Corpse: {enemy.ragdollMaterial}</div>
      <div>Predator: {enemy.genomeData?.isPredator ? 'Yes' : 'No'}</div>
      <div>{enemy.knockBackResistance}</div>

      <br />
      <div>
        <Flex style={{ flexWrap: 'wrap' }}>
          {enemy.gameEffects
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
          <div key={v.variantId}>
            {v.variantId}: {v.enemy.hp}
          </div>
        ))}
      </div>
    </div>
  );
};
