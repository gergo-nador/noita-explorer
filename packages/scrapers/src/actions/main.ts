import { deleteBonesWands } from './save00/persistent/delete-bones-wands.ts';
import { unlockPerk } from './save00/persistent/unlock-perk.ts';
import { unlockSpell } from './save00/persistent/unlock-spell.ts';
import { unlockEnemy } from './save00/stats/unlock-enemy.ts';

export const actions = {
  deleteBonesWands: deleteBonesWands,
  unlockPerk: unlockPerk,
  unlockSpell: unlockSpell,
  unlockEnemy: unlockEnemy,
};
