import { NoitaEnemy } from '@noita-explorer/model-noita';
import { useNoitaUnits } from '../../../hooks/use-noita-units.ts';
import { useSettingsStore } from '../../../stores/settings.ts';
import {
  Header,
  Icon,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
import { NoitaProtections } from '../../../noita/noita-protections.ts';
import { DamageMultiplierDisplay } from './damage-multiplier-display.tsx';
import { CopyLinkText } from '../../../components/copy-link-text.tsx';
import { publicPaths } from '../../../utils/public-paths.ts';
import { SpaceCharacter } from '../../../components/space-character.tsx';
import { EnemyMediaComponent } from './enemy-media-component.tsx';

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
          <CopyLinkText
            link={publicPaths.generated.wiki.enemies(enemy.id)}
            iconSize={24}
          >
            <div
              style={{
                fontSize: 'clamp(1.4rem, 2vw, 2.2rem)',
                lineHeight: 1.2,
              }}
            >
              {enemy.name}
            </div>
          </CopyLinkText>
          {progressDisplayDebugData && (
            <div style={{ marginTop: 5 }}>{enemy.id}</div>
          )}
        </Flex>
      </div>

      <br />
      {progressDisplayDebugData && (
        <div>
          <Header title='Debug'>
            <div style={{ fontSize: 18 }}>Tags:</div>
            <div>{enemy.tags.join(', ')}</div>
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
        <Icon src={publicPaths.static.dataWak.misc('heart')} size={16} />
      </div>
      {enemy.maxHp !== undefined && (
        <div>
          Max Hp:<span style={{ color: '#f14343' }}> {enemy.maxHp} </span>
          <Icon src={publicPaths.static.dataWak.misc('heart')} size={16} />
        </div>
      )}

      {enemy.hasGoldDrop && (
        <div>
          Gold:<span style={{ color: '#fae27e' }}> {enemy.goldDrop} </span>
          <Icon
            src={publicPaths.static.dataWak.misc('goldnugget_icon')}
            size={16}
          />
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
                        (For
                        <SpaceCharacter />
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
                <Icon src={NoitaProtections[gameEffect.id].image} size={50} />
              </NoitaTooltipWrapper>
            ))}
        </Flex>
      </div>

      <br />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
        <div style={{ gridColumnStart: 1, gridColumnEnd: -1 }}>
          <DamageMultiplierDisplay
            name='projectile'
            icon={publicPaths.static.dataWak.damages('icon_damage_projectile')}
            iconColor={publicPaths.static.dataWak.damages(
              'icon_damage_projectile_color',
            )}
            value={enemy.damageMultipliers.projectile}
          />
        </div>
        <div>
          <DamageMultiplierDisplay
            name='explosion'
            icon={publicPaths.static.dataWak.damages('icon_damage_explosion')}
            iconColor={publicPaths.static.dataWak.damages(
              'icon_damage_explosion_color',
            )}
            value={enemy.damageMultipliers.explosion}
          />
        </div>
        <div>
          <DamageMultiplierDisplay
            name='melee'
            icon={publicPaths.static.dataWak.damages('icon_damage_melee')}
            iconColor={publicPaths.static.dataWak.damages(
              'icon_damage_melee_color',
            )}
            value={enemy.damageMultipliers.melee}
          />
        </div>
        <div>
          <DamageMultiplierDisplay
            name='slice'
            icon={publicPaths.static.dataWak.damages('icon_damage_slice')}
            iconColor={publicPaths.static.dataWak.damages(
              'icon_damage_slice_color',
            )}
            value={enemy.damageMultipliers.slice}
          />
        </div>
        <div>
          <DamageMultiplierDisplay
            name='fire'
            icon={publicPaths.static.dataWak.damages('icon_damage_fire')}
            iconColor={publicPaths.static.dataWak.damages(
              'icon_damage_fire_color',
            )}
            value={enemy.damageMultipliers.fire}
          />
        </div>
        <div>
          <DamageMultiplierDisplay
            name='electric'
            icon={publicPaths.static.dataWak.damages('icon_damage_electricity')}
            iconColor={publicPaths.static.dataWak.damages(
              'icon_damage_electricity_color',
            )}
            value={enemy.damageMultipliers.electricity}
          />
        </div>
        <div>
          <DamageMultiplierDisplay
            name='ice'
            icon={publicPaths.static.dataWak.damages('icon_damage_ice')}
            iconColor={publicPaths.static.dataWak.damages(
              'icon_damage_ice_color',
            )}
            value={enemy.damageMultipliers.ice}
          />
        </div>
        <div>
          <DamageMultiplierDisplay
            name='toxic'
            icon={publicPaths.static.dataWak.damages(
              'icon_damage_radioactivity',
            )}
            iconColor={publicPaths.static.dataWak.damages(
              'icon_damage_radioactivity_color',
            )}
            value={enemy.damageMultipliers.radioactive}
          />
        </div>
        <div>
          <DamageMultiplierDisplay
            name='drill'
            icon={publicPaths.static.dataWak.damages('icon_damage_drill')}
            iconColor={publicPaths.static.dataWak.damages(
              'icon_damage_drill_color',
            )}
            value={enemy.damageMultipliers.drill}
          />
        </div>
        <div>
          <DamageMultiplierDisplay
            name='holy'
            icon={publicPaths.static.dataWak.damages('icon_damage_holy')}
            iconColor={publicPaths.static.dataWak.damages(
              'icon_damage_holy_color',
            )}
            value={enemy.damageMultipliers.holy}
          />
        </div>
      </div>

      <br />

      <EnemyMediaComponent enemy={enemy} />

      {enemy.variants.length > 0 && (
        <div>
          <hr />
          Variants:
          {enemy.variants.map((v) => (
            <div key={v.variantId}>
              {v.variantId}: {v.enemy.hp}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
