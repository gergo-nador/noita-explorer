import { NoitaWand } from '@noita-explorer/model';
import {
  ActiveIconWrapper,
  Card,
  Icon,
  InventoryIcon,
} from '@noita-explorer/noita-component-library';
import { mathHelpers } from '@noita-explorer/tools';
import { useNoitaUnits } from '../hooks/useNoitaUnits.ts';
import React, { useMemo } from 'react';
import { useNoitaDataWakStore } from '../stores/NoitaDataWak.ts';
import { Flex } from './Flex.tsx';
import { NoitaSpellTooltip } from './tooltips/NoitaSpellTooltip.tsx';
import { NoitaSpellTypesDictionary } from '../noita/NoitaSpellTypeDictionary.ts';

import gunShuffleIcon from '../assets/icons/icon_gun_shuffle.png';
import fireRateWaitIcon from '../assets/icons/spells/icon_fire_rate_wait.png';
import reloadIcon from '../assets/icons/spells/icon_reload_time.png';
import speedModifierIcon from '../assets/icons/spells/icon_speed_multiplier.png';
import spreadIcon from '../assets/icons/spells/icon_spread_degrees.png';
import capacityIcon from '../assets/icons/icon_gun_capacity.png';
import manaMaxIcon from '../assets/icons/icon_mana_max.png';
import manaChargeIcon from '../assets/icons/icon_mana_charge_speed.png';
import actionsPerRoundIcon from '../assets/icons/icon_gun_actions_per_round.png';

interface NoitaWandCardProps {
  wand: NoitaWand;
}

export const NoitaWandCard = ({ wand }: NoitaWandCardProps) => {
  const noitaUnits = useNoitaUnits();
  const { data } = useNoitaDataWakStore();

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

    const displaySpells: React.ReactNode[] = [];

    for (let i = 0; i < wand.deckCapacity; i++) {
      const wandSpell = wand.spells.find((s) => s.inventorySlot === i);
      if (wandSpell === undefined) {
        const noSpellInventoryIcon = <InventoryIcon size={40} />;
        displaySpells.push(noSpellInventoryIcon);
        continue;
      }

      const spell = data.spells.find((s) => s.id === wandSpell.spellId);
      if (spell === undefined) {
        const spellNotFoundIcon = <Icon type={'error'} size={40} />;
        displaySpells.push(spellNotFoundIcon);
        continue;
      }

      const spellComponent = (
        <ActiveIconWrapper
          key={'spell-' + wandSpell.spellId + wandSpell.inventorySlot}
          id={'spell-' + wandSpell.spellId + wandSpell.inventorySlot}
          tooltip={<NoitaSpellTooltip spell={spell} />}
        >
          <InventoryIcon
            icon={spell.imageBase64}
            spellBackground={NoitaSpellTypesDictionary[spell.type].image}
            size={40}
          />
        </ActiveIconWrapper>
      );
      displaySpells.push(spellComponent);
    }

    return displaySpells;
  }, [wand, data?.spells]);

  const rows: RowData[] = [
    {
      icon: <Icon type={'custom'} src={gunShuffleIcon} size={15} />,
      text: 'Shuffle',
      value: wand.shuffle ? 'Yes' : 'No',
    },
    {
      icon: <Icon type={'custom'} src={actionsPerRoundIcon} size={15} />,
      text: 'Spells/Cast',
      value: wand.actionsPerRound,
    },
    {
      icon: <Icon type={'custom'} src={fireRateWaitIcon} size={15} />,
      text: 'Cast delay',
      value: noitaUnits.frames(wand.fireRateWait),
    },
    {
      icon: <Icon type={'custom'} src={reloadIcon} size={15} />,
      text: 'Rechrg. Time',
      value: noitaUnits.frames(wand.reloadTime),
    },
    {
      icon: <Icon type={'custom'} src={manaMaxIcon} size={15} />,
      text: 'Mana max',
      value: wand.manaMax,
    },
    {
      icon: <Icon type={'custom'} src={manaChargeIcon} size={15} />,
      text: 'Mana chg. Spd',
      value: wand.manaChargeSpeed,
    },
    {
      icon: <Icon type={'custom'} src={capacityIcon} size={15} />,
      text: 'Capacity',
      value: wand.deckCapacity,
    },
    {
      icon: <Icon type={'custom'} src={spreadIcon} size={15} />,
      text: 'Spread',
      value: noitaUnits.degree(wand.spreadMultiplier),
    },
    {
      icon: <Icon type={'custom'} src={speedModifierIcon} size={15} />,
      text: 'Speed Multiplier',
      value: mathHelpers.round(wand.speedMultiplier, 3),
    },
  ];

  return (
    <Card style={{ width: 'max-content', maxWidth: '100%' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'max-content max-content',
        }}
      >
        <div>
          <div style={{ fontSize: 20 }}>{wand.name}</div>
          <br />
          <table>
            <tbody>
              {rows.map((row) => (
                <tr>
                  <td>{row.icon}</td>
                  <td>{row.text}</td>
                  <td style={{ paddingLeft: 5 }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {wandImage && (
            <Icon type={'custom'} src={wandImage} style={{ zoom: 5 }} />
          )}
        </div>
      </div>

      <br />
      <Flex
        style={{
          width: 'max-content',
          maxWidth: '100%',
          justifyContent: 'left',
        }}
        gap={5}
      >
        {spellIcons}
      </Flex>
    </Card>
  );
};

interface RowData {
  icon?: React.ReactNode;
  text: string;
  value: string | React.ReactNode;
}
