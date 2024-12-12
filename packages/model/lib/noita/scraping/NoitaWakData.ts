import { NoitaEnemy } from '../NoitaEnemy';
import { NoitaPerk } from '../NoitaPerk';
import { NoitaSpell } from '../NoitaSpell';

export interface NoitaWakData {
  scrapedAt: string;
  scrapedAtUnix: number;
  enemies: NoitaEnemy[];
  perks: NoitaPerk[];
  spells: NoitaSpell[];
}
