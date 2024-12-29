import { NoitaEnemy } from '../NoitaEnemy';
import { NoitaPerk } from '../NoitaPerk';
import { NoitaSpell } from '../NoitaSpell';
import { NoitaTranslation } from './NoitaTranslation';
import { StringKeyDictionary } from '../../common/StringKeyDictionary';
import { NoitaWandConfig } from '../NoitaWandConfig.ts';

export interface NoitaWakData {
  scrapedAt: string;
  scrapedAtUnix: number;
  version: number;

  enemies: NoitaEnemy[];
  perks: NoitaPerk[];
  spells: NoitaSpell[];
  wandConfigs: NoitaWandConfig[];
  translations: StringKeyDictionary<NoitaTranslation>;
}
