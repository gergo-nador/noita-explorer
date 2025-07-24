import { NoitaEnemy, NoitaEnemyVariant } from '../common/entity/noita-enemy.ts';
import { NoitaScrapedSprite } from './noita-scraped-sprite.ts';

export type NoitaScrapedEnemy = Omit<NoitaEnemy, 'gifs' | 'variants'> & {
  sprites: NoitaScrapedSprite[] | undefined;
  variants: NoitaScrapedEnemyVariant[];
};

export type NoitaScrapedEnemyVariant = Omit<NoitaEnemyVariant, 'enemy'> & {
  enemy: Omit<NoitaScrapedEnemy, 'variants'>;
};
