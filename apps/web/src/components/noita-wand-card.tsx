import { NoitaConstants, NoitaWand } from '@noita-explorer/model-noita';
import {
  ActiveIconWrapper,
  Card,
  Icon,
  InventoryIcon,
} from '@noita-explorer/noita-component-library';
import { randomHelpers, mathHelpers } from '@noita-explorer/tools';
import { useNoitaUnits } from '../hooks/use-noita-units.ts';
import React, { useMemo } from 'react';
import { useNoitaDataWakStore } from '../stores/noita-data-wak.ts';
import { NoitaSpellTooltip } from './tooltips/noita-spell-tooltip.tsx';
import { NoitaSpellTypesDictionary } from '../noita/noita-spell-type-dictionary.ts';
import css from './noita-wand-card.module.css';
import { noitaAPI } from '../noita-api.ts';
import { useNoitaActionsStore } from '../stores/actions.ts';
import { Flex } from '@noita-explorer/react-utils';
import { ConditionalWrapper } from '@noita-explorer/react-utils';
import { publicPaths } from '../utils/public-paths.ts';

interface NoitaWandCardProps {
  wand: NoitaWand;
  bonesFileName?: string;
  withoutCardBorder?: boolean;
}

export const NoitaWandCard = ({
  wand,
  bonesFileName,
  withoutCardBorder,
}: NoitaWandCardProps) => {
  const noitaUnits = useNoitaUnits();
  const { data } = useNoitaDataWakStore();
  const { actionUtils } = useNoitaActionsStore();

  const wandTooltipId = useMemo(() => randomHelpers.randomInt(0, 1000000), []);

  const wandImage = useMemo(() => {
    const wandConfigs = data?.wandConfigs;
    if (wandConfigs === undefined) {
      return undefined;
    }

    const wandConfig = wandConfigs.find(
      (config) => config.spriteId === wand.spriteId,
    );
    if (wandConfig === undefined) {
      return undefined;
    }

    return wandConfig.imageBase64;
  }, [wand, data?.wandConfigs]);

  const spellIcons = useMemo(() => {
    if (data?.spells === undefined) {
      return undefined;
    }

    const displaySpells: { key: string; spellComponent: React.ReactNode }[] =
      [];

    for (let i = 0; i < wand.deckCapacity; i++) {
      const iconSize = 35;

      const wandSpell = wand.spells.find((s) => s.inventorySlot === i);
      if (wandSpell === undefined) {
        const noSpellInventoryIcon = <InventoryIcon size={iconSize} />;
        displaySpells.push({
          key: 'none-' + i,
          spellComponent: noSpellInventoryIcon,
        });
        continue;
      }

      const key = `spell-${wandSpell.spellId}-${wandSpell.inventorySlot}-${wandTooltipId}`;
      const spell = data.spells.find((s) => s.id === wandSpell.spellId);
      if (spell === undefined) {
        const spellNotFoundIcon = <Icon type={'error'} size={iconSize} />;
        displaySpells.push({ key, spellComponent: spellNotFoundIcon });
        continue;
      }

      const largerManaDrainThanWandMaxMana =
        (spell.manaDrain ?? 0) > wand.manaMax;

      const spellComponent = (
        <ActiveIconWrapper
          id={key}
          tooltip={
            <NoitaSpellTooltip
              spell={spell}
              wandSpell={wandSpell}
              warnings={{
                manaTooMuch: largerManaDrainThanWandMaxMana,
              }}
            />
          }
        >
          <InventoryIcon
            icon={spell.imageBase64}
            spellBackground={NoitaSpellTypesDictionary[spell.type].image}
            size={iconSize}
            usesRemaining={wandSpell.usesRemaining}
            showWarning={largerManaDrainThanWandMaxMana}
          />
        </ActiveIconWrapper>
      );
      displaySpells.push({ key, spellComponent });
    }

    return displaySpells;
  }, [wand, data?.spells, wandTooltipId]);

  const spellIconsAlwaysCast = useMemo(() => {
    if (data?.spells === undefined) {
      return undefined;
    }

    const iconSize = 35;
    const displaySpells: React.ReactNode[] = [];

    for (let i = 0; i < wand.alwaysCastSpells.length; i++) {
      const wandSpell = wand.alwaysCastSpells[i];

      const spell = data.spells.find((s) => s.id === wandSpell.spellId);
      if (spell === undefined) {
        const spellNotFoundIcon = <Icon type={'error'} size={iconSize} />;
        displaySpells.push(spellNotFoundIcon);
        continue;
      }

      const spellComponent = (
        <ActiveIconWrapper
          key={`spell-${wandSpell.spellId}-${i}-${wandTooltipId}`}
          id={`spell-${wandSpell.spellId}-${i}-${wandTooltipId}`}
          tooltip={<NoitaSpellTooltip spell={spell} />}
        >
          <InventoryIcon
            icon={spell.imageBase64}
            spellBackground={NoitaSpellTypesDictionary[spell.type].image}
            size={iconSize}
          />
        </ActiveIconWrapper>
      );

      displaySpells.push(spellComponent);
    }

    return displaySpells;
  }, [wand, data?.spells, wandTooltipId]);

  const rows: RowData[] = [
    {
      icon: (
        <Icon
          src={publicPaths.static.dataWak.icons('icon_gun_shuffle')}
          size={15}
        />
      ),
      text: 'Shuffle',
      value: wand.shuffle ? 'Yes' : 'No',
    },
    {
      icon: (
        <Icon
          src={publicPaths.static.dataWak.icons('icon_gun_actions_per_round')}
          size={15}
        />
      ),
      text: 'Spells/Cast',
      value: wand.actionsPerRound,
    },
    {
      icon: (
        <Icon
          src={publicPaths.static.dataWak.spellProperties(
            'icon_fire_rate_wait',
          )}
          size={15}
        />
      ),
      text: 'Cast delay',
      value: noitaUnits.frames(
        wand.fireRateWait,
        noitaUnits.frameDefaultUnits.fireRateWait,
      ),
    },
    {
      icon: (
        <Icon
          src={publicPaths.static.dataWak.spellProperties('icon_reload_time')}
          size={15}
        />
      ),
      text: 'Rechrg. Time',
      value: noitaUnits.frames(
        wand.reloadTime,
        noitaUnits.frameDefaultUnits.reloadTime,
      ),
    },
    {
      icon: (
        <Icon
          src={publicPaths.static.dataWak.icons('icon_mana_max')}
          size={15}
        />
      ),
      text: 'Mana max',
      value: wand.manaMax,
    },
    {
      icon: (
        <Icon
          src={publicPaths.static.dataWak.icons('icon_mana_charge_speed')}
          size={15}
        />
      ),
      text: 'Mana chg. Spd',
      value: (() => {
        const timeUntilFullCharge = wand.manaMax / wand.manaChargeSpeed;
        const displayTime = noitaUnits.frames(
          timeUntilFullCharge * NoitaConstants.framesPerSecond,
          noitaUnits.frameDefaultUnits.wandRechargeTime,
        );

        return `${wand.manaChargeSpeed} (${displayTime})`;
      })(),
    },
    {
      icon: (
        <Icon
          src={publicPaths.static.dataWak.icons('icon_gun_capacity')}
          size={15}
        />
      ),
      text: 'Capacity',
      value: wand.deckCapacity,
    },
    {
      icon: (
        <Icon
          src={publicPaths.static.dataWak.spellProperties(
            'icon_spread_degrees',
          )}
          size={15}
        />
      ),
      text: 'Spread',
      value: noitaUnits.degree(wand.spreadMultiplier),
    },
    {
      icon: (
        <Icon
          src={publicPaths.static.dataWak.spellProperties(
            'icon_speed_multiplier',
          )}
          size={15}
        />
      ),
      text: 'Speed Multiplier',
      value: mathHelpers.round(wand.speedMultiplier, 3),
    },
  ];

  const isOnDeleteList = actionUtils.deleteBonesWand.isOnList(
    bonesFileName ?? '',
  );

  return (
    <ConditionalWrapper
      condition={!withoutCardBorder}
      wrapper={(children) => (
        <Card
          className={css['container']}
          style={{
            maxWidth: '100%',
          }}
          styling={{
            borderBright: isOnDeleteList ? '#d55456' : undefined,
            borderDark: isOnDeleteList ? '#d55456' : undefined,
          }}
        >
          {children}
        </Card>
      )}
    >
      <div style={{ width: 'min-content' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'max-content max-content',
            gap: 30,
            position: 'relative',
          }}
        >
          <div>
            <div style={{ fontSize: 20 }}>{wand.name}</div>
            {noitaAPI.environment.features.bonesWandDelete && bonesFileName && (
              <>
                <div style={{ opacity: 0.6, marginTop: 5 }}>
                  {bonesFileName}
                </div>
                <div
                  className={css['visible-on-hover']}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                  }}
                  onClick={() => {
                    if (!isOnDeleteList) {
                      actionUtils.deleteBonesWand.create(bonesFileName);
                      return;
                    }

                    const action =
                      actionUtils.deleteBonesWand.get(bonesFileName);
                    if (action) {
                      actionUtils.removeAction(action);
                    }
                  }}
                >
                  <Icon
                    size={20}
                    type={'cross'}
                    style={
                      isOnDeleteList
                        ? {
                            cursor: 'pointer',
                            filter: 'grayscale()',
                          }
                        : { cursor: 'pointer' }
                    }
                  />
                </div>
              </>
            )}

            <br />
            <table>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.text}>
                    <td>{row.icon}</td>
                    <td>{row.text}</td>
                    <td style={{ paddingLeft: 15 }}>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Flex center>
            {wandImage && (
              <Icon
                src={wandImage}
                style={{ zoom: 5, transform: 'rotate(-90deg)' }}
              />
            )}
          </Flex>
        </div>

        {wand.alwaysCastSpells.length > 0 && (
          <>
            <br />
            <Flex
              wrap='wrap'
              gap={10}
              align='center'
              style={{
                paddingLeft: 2,
              }}
            >
              <Icon
                src={publicPaths.static.dataWak.icons(
                  'icon_gun_permanent_actions',
                )}
                size={15}
              />
              <div style={{ paddingRight: 10 }}>Always casts</div>
              {spellIconsAlwaysCast}
            </Flex>
          </>
        )}

        <br />
        <Flex wrap='wrap' gap={5}>
          {spellIcons?.map((icon) => (
            <div key={icon.key} style={{ display: 'contents' }}>
              {icon.spellComponent}
            </div>
          ))}
        </Flex>
        {wand.spellsPossibleIncorrectOrder && (
          <div>
            <Icon type={'warning'} size={30} />
            <span>Spell order might be incorrect</span>
            <Icon type={'warning'} size={30} />
          </div>
        )}
      </div>
    </ConditionalWrapper>
  );
};

interface RowData {
  icon?: React.ReactNode;
  text: string;
  value: string | React.ReactNode;
}
