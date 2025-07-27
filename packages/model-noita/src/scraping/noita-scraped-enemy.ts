import {
  NoitaScrapedPhysicsImageShapeComponent,
  NoitaScrapedSprite,
} from './noita-scraped-sprite.ts';
import { NoitaEnemy, NoitaEnemyVariant } from '../common/enemy/noita-enemy.ts';

export type NoitaScrapedEnemy = Omit<NoitaEnemy, 'media' | 'variants'> & {
  sprites: NoitaScrapedSprite[] | undefined;
  physicsImageShapes: NoitaScrapedPhysicsImageShapeComponent[] | undefined;
  variants: NoitaScrapedEnemyVariant[];
};

export type NoitaScrapedEnemyVariant = Omit<NoitaEnemyVariant, 'enemy'> & {
  enemy: Omit<NoitaScrapedEnemy, 'variants'>;
};
