import { NoitaSpell } from '../NoitaSpell';
import { NoitaPerk } from '../NoitaPerk';
import { NoitaEnemy } from '../NoitaEnemy';
import { NoitaDataWakScrapeResultPart } from './NoitaDataWakScrapeResultPart.ts';
import { StringKeyDictionary } from '../../common/StringKeyDictionary';
import { NoitaTranslation } from './NoitaTranslation';
import { NoitaWandConfig } from '../NoitaWandConfig.ts';

export interface NoitaDataWakScrapeResult {
  translations: NoitaDataWakScrapeResultPart<
    StringKeyDictionary<NoitaTranslation>
  >;
  spells: NoitaDataWakScrapeResultPart<NoitaSpell[]>;
  perks: NoitaDataWakScrapeResultPart<NoitaPerk[]>;
  enemies: NoitaDataWakScrapeResultPart<NoitaEnemy[]>;
  wandConfigs: NoitaDataWakScrapeResultPart<NoitaWandConfig[]>;
}
