import { SpellModifierNumberUnit } from './SpellModifierNumberUnit';
import { NoitaProgressEntity } from './NoitaProgressEntity';

export interface NoitaSpell extends NoitaProgressEntity {
  description: string;
  type: string;

  // properties from gun_actions
  price: number;
  maxUses: number | undefined;
  manaDrain: number;
  neverUnlimited: boolean;
  recursive: boolean;
  isDangerousBlast: boolean;

  // properties from xml
  explosionDontDamageShooter: boolean;
  friendlyFire: boolean;
  lifetime: number | undefined;
  lifetimeRandomness: number | undefined;
  diggingPower: number | undefined;

  projectileDamage: number | undefined;
  explosionDamage: number | undefined;
  explosionRadius: number | undefined;
  sliceDamage: number | undefined;
  meleeDamage: number | undefined;
  fireDamage: number | undefined;
  healingDamage: number | undefined;
  regenerationFrames: number | undefined;
  electricityDamage: number | undefined;
  drillDamage: number | undefined;
  iceDamage: number | undefined;
  holyDamage: number | undefined;

  // properties from lua action
  speedModifier: SpellModifierNumberUnit | undefined;
  recoilModifier: SpellModifierNumberUnit | undefined;
  fireRateWaitModifier: SpellModifierNumberUnit | undefined;
  reloadTimeModifier: SpellModifierNumberUnit | undefined;
  spreadDegreesModifier: SpellModifierNumberUnit | undefined;
  lifetimeModifier: SpellModifierNumberUnit | undefined;

  projectileDamageModifier: SpellModifierNumberUnit | undefined;
  explosionDamageModifier: SpellModifierNumberUnit | undefined;
  explosionRadiusModifier: SpellModifierNumberUnit | undefined;
  iceDamageModifier: SpellModifierNumberUnit | undefined;

  // others
  spawnRequiredFlag: string | undefined;
}
