import { NoitaEnemy } from './NoitaEnemy';

export interface NoitaEnemyGroup {
  baseId: string;
  name: string;
  index: number;
  imageBase64: string;
  enemies: NoitaEnemy[];
}
