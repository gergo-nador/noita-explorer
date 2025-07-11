import { NoitaEnemy, NoitaEnemyVariant } from '../common/entity/noita-enemy.ts';

export type NoitaScrapedEnemy = Omit<NoitaEnemy, 'gifs' | 'variants'> & {
  variants: NoitaScrapedEnemyVariant[];
};

export type NoitaScrapedEnemyVariant = Omit<NoitaEnemyVariant, 'enemy'> & {
  enemy: Omit<NoitaScrapedEnemy, 'variants'>;
};
