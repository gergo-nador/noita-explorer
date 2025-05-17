import { NoitaProgressEntity } from './noita-progress-entity.ts';

export interface NoitaEnemy extends NoitaProgressEntity {
  id: string;
  name: string;
  imageBase64: string;
  hp: number | undefined;
  maxHp: number | undefined;
  airNeeded: boolean | undefined;
  bloodMaterial: string | undefined;
  ragdollMaterial: string | undefined;
  fireProbabilityOfIgnition: number | undefined;
  materialsThatDamage: NoitaEnemyMaterialDamage[] | undefined;
  genomeData: NoitaEnemyGenomeData | undefined;
  knockBackResistance: number | undefined;
  goldDrop: number | undefined;
  hasGoldDrop: boolean;
  physicsObjectsDamage: boolean | undefined;

  damageMultipliers: NoitaEnemyDamageMultipliers;
  variants: NoitaEnemyVariant[];
  gameEffects: NoitaEnemyGameEffect[];

  debug: NoitaEnemyDebugObject;
}

export interface NoitaEnemyMaterialDamage {
  name: string;
  multiplier: number;
}

export interface NoitaEnemyGenomeData {
  herdId?: string;
  foodChainRank?: number;
  isPredator?: boolean;
}

export interface NoitaEnemyVariant {
  variantId: string;
  enemy: NoitaEnemy;
}

export interface NoitaEnemyGameEffect {
  id: string;
  frames: number;
}

export interface NoitaEnemyDamageMultipliers {
  projectile: number;
  explosion: number;
  melee: number;
  slice: number;
  fire: number;
  electricity: number;
  ice: number;
  radioactive: number;
  drill: number;
  holy: number;
}

export interface NoitaEnemyDebugObject {
  fileHierarchy: string[];
  entityTags: string[];
  imagePath: string;
}
