import { NoitaDamageMultipliers } from '../noita-damage-multiplier.ts';

export interface NoitaDamageModel {
  airInLungs: number | undefined;
  airInLungsMax: number | undefined;
  airLackOfDamage: number | undefined;
  bloodMaterial: string;
  hp: number;
  maxHp: number;
  damageMultipliers: NoitaDamageMultipliers;
}
