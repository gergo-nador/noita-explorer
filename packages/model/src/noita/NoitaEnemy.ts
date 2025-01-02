import { NoitaProgressEntity } from './NoitaProgressEntity';

export interface NoitaEnemy extends NoitaProgressEntity {
  id: string;
  name: string;
  imageBase64: string;
  hp: number | undefined;
  bloodMaterial: string | undefined;
  materialsThatDamage: NoitaEnemyMaterialDamage[] | undefined;
  genomeData: NoitaEnemyGenomeData | undefined;
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
