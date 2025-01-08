import { NoitaProgressEntity } from './NoitaProgressEntity';

export interface NoitaEnemy extends NoitaProgressEntity {
  id: string;
  name: string;
  imageBase64: string;
  hp: number | undefined;
  maxHp: number | undefined;
  bloodMaterial: string | undefined;
  materialsThatDamage: NoitaEnemyMaterialDamage[] | undefined;
  genomeData: NoitaEnemyGenomeData | undefined;
  knockBackResistance: number | undefined;
  goldDrop: boolean;
  variants: NoitaEnemyVariant[];
}

export interface NoitaEnemyMaterialDamage {
  name: string;
  multiplier: number;
}

export interface NoitaEnemyGenomeData {
  herdId?: string;
  foodChainRank?: number;
  isPredator: boolean;
}

export interface NoitaEnemyVariant {
  biome: string;
  hp: number | undefined;
  maxHp: number | undefined;
  knockBackResistance: number | undefined;
}
