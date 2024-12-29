import { NoitaWand } from '@noita-explorer/model';
import { Card, Icon } from '@noita-explorer/noita-component-library';
import { mathHelpers } from '@noita-explorer/tools';
import { useNoitaUnits } from '../hooks/useNoitaUnits.ts';
import React, { useMemo } from 'react';

import gunShuffleIcon from '../assets/icons/icon_gun_shuffle.png';
import fireRateWaitIcon from '../assets/icons/spells/icon_fire_rate_wait.png';
import reloadIcon from '../assets/icons/spells/icon_reload_time.png';
import speedModifierIcon from '../assets/icons/spells/icon_speed_multiplier.png';
import spreadIcon from '../assets/icons/spells/icon_spread_degrees.png';
import capacityIcon from '../assets/icons/icon_gun_capacity.png';
import manaMaxIcon from '../assets/icons/icon_mana_max.png';
import manaChargeIcon from '../assets/icons/icon_mana_charge_speed.png';
import actionsPerRoundIcon from '../assets/icons/icon_gun_actions_per_round.png';
import { useNoitaDataWakStore } from '../stores/NoitaDataWak.ts';

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
      console.log('Couldnt find wand config', wand.spriteId);
      return undefined;
    }

    return wandConfig.imageBase64;
  }, [wand, data?.wandConfigs]);

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
    <Card>
      <div>{wand.name}</div>
      {wandImage && (
        <Icon type={'custom'} src={wandImage} style={{ zoom: 3.5 }} />
      )}
      <table>
        <tbody>
          <tr>
            <td>
              <Icon type={'custom'} src={gunShuffleIcon} size={15} />
            </td>
            <td>Shuffle</td>
            <td>{wand.shuffle ? 'Yes' : 'No'}</td>
          </tr>
          {rows.map((row) => (
            <tr>
              <td>{row.icon}</td>
              <td>{row.text}</td>
              <td style={{ paddingLeft: 5 }}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div></div>
    </Card>
  );
};

interface RowData {
  icon?: React.ReactNode;
  text: string;
  value: string | React.ReactNode;
}
