import { NoitaWandSpell } from './noita-wand-spell.ts';

export interface NoitaWand {
  name: string;
  spriteId: string;

  mana: number;
  manaChargeSpeed: number;
  manaMax: number;

  reloadTime: number;
  fireRateWait: number;

  deckCapacity: number;
  actionsPerRound: number;
  shuffle: boolean;

  spreadMultiplier: number;
  speedMultiplier: number;

  alwaysCastSpells: NoitaWandSpell[];
  spells: NoitaWandSpell[];
  spellsPossibleIncorrectOrder: boolean;
}
