import { deleteBonesWands } from './save00/persistent/delete-bones-wands.ts';
import { unlockPerk } from './save00/persistent/unlock-perk.ts';
import { unlockSpell } from './save00/persistent/unlock-spell.ts';
import { unlockEnemy } from './save00/stats/unlock-enemy.ts';
import { unlockDecoration } from './save00/persistent/unlock-decoration.ts';
import { createFlag } from './save00/persistent/create-flag.ts';

export const actions = {
  deleteBonesWands: deleteBonesWands,
  unlockEnemy: unlockEnemy,
  unlockPerk: unlockPerk,
  unlockSpell: unlockSpell,
  unlockDecoration: unlockDecoration,
  unlockFlag: createFlag,
};
