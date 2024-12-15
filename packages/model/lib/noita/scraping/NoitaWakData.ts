import { NoitaEnemy } from '../NoitaEnemy';
import { NoitaPerk } from '../NoitaPerk';
import { NoitaSpell } from '../NoitaSpell';
import { NoitaTranslation } from './NoitaTranslation';
import { StringKeyDictionary } from '../../../dist/common/StringKeyDictionary';

export interface NoitaWakData {
  scrapedAt: string;
  scrapedAtUnix: number;
  version: number;
  enemies: NoitaEnemy[];
  perks: NoitaPerk[];
  spells: NoitaSpell[];
  translations: StringKeyDictionary<NoitaTranslation>;
}
