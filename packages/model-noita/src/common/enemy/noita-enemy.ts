import { NoitaProgressEntity } from '../noita-progress-entity.ts';
import { NoitaDamageMultipliers } from './noita-damage-multiplier.ts';
import { NoitaGenomeData } from './noita-genome-data.ts';
import { NoitaEnemyMedia } from './noita-enemy-media.ts';

export interface NoitaEnemy extends NoitaProgressEntity {
  id: string;
  name: string;
  hp: number | undefined;
  maxHp: number | undefined;
  airNeeded: boolean | undefined;
  bloodMaterial: string | undefined;
  ragdollMaterial: string | undefined;
  fireProbabilityOfIgnition: number | undefined;
  materialsThatDamage: NoitaEnemyMaterialDamage[] | undefined;
  genomeData: NoitaGenomeData | undefined;
  knockBackResistance: number | undefined;
  goldDrop: number | undefined;
  hasGoldDrop: boolean;
  physicsObjectsDamage: boolean | undefined;

  damageMultipliers: NoitaDamageMultipliers;
  variants: NoitaEnemyVariant[];
  gameEffects: NoitaEnemyGameEffect[];

  tags: string[];
  debug: NoitaEnemyDebugObject;

  media: NoitaEnemyMedia | undefined;
}

export interface NoitaEnemyMaterialDamage {
  name: string;
  multiplier: number;
}

export interface NoitaEnemyVariant {
  variantId: string;
  enemy: Omit<NoitaEnemy, 'variants'>;
}

export interface NoitaEnemyGameEffect {
  id: string;
  frames: number;
}

export interface NoitaEnemyDebugObject {
  fileHierarchy: string[];
  imagePath: string;
}
