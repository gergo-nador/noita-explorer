import { NoitaSpell } from '../common/NoitaSpell.ts';
import { NoitaPerk } from '../common/NoitaPerk.ts';
import { NoitaEnemy } from '../common/NoitaEnemy.ts';
import { NoitaDataWakScrapeResultPart } from './NoitaDataWakScrapeResultPart.ts';
import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaTranslation } from './NoitaTranslation.ts';
import { NoitaWandConfig } from '../common/NoitaWandConfig.ts';

export interface NoitaDataWakScrapeResult {
  translations: NoitaDataWakScrapeResultPart<
    StringKeyDictionary<NoitaTranslation>
  >;
  spells: NoitaDataWakScrapeResultPart<NoitaSpell[]>;
  perks: NoitaDataWakScrapeResultPart<NoitaPerk[]>;
  enemies: NoitaDataWakScrapeResultPart<NoitaEnemy[]>;
  wandConfigs: NoitaDataWakScrapeResultPart<NoitaWandConfig[]>;
}
