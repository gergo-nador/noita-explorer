import { NoitaEnemy } from './noita-enemy.ts';

export interface NoitaEnemyGroup {
  baseId: string;
  name: string;
  index: number;
  imagePath: string;
  enemies: NoitaEnemy[];
}
