import { NoitaConstants } from '@noita-explorer/model-noita';
import { mathHelpers } from '@noita-explorer/tools';

export const calculateEnemyGold = (hp: number) => {
  // based on data\scripts\items\drop_money.lua

  let originalHp = hp / NoitaConstants.hpMultiplier;
  if (originalHp > 1) {
    originalHp = mathHelpers.floor(originalHp);
  }

  const calculatedGold = originalHp * NoitaConstants.hpGoldMultiplier;
  const actualGold = Math.max(calculatedGold, NoitaConstants.minGoldDrop);

  return mathHelpers.round(actualGold);
};
