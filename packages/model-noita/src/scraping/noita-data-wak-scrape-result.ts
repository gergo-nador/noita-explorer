import { NoitaSpell } from '../common/spell/noita-spell.ts';
import { NoitaPerk } from '../common/noita-perk.ts';
import { NoitaDataWakScrapeResultPart } from './noita-data-wak-scrape-result-part.ts';
import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaTranslation } from './noita-translation.ts';
import { NoitaWandConfig } from '../common/wand/noita-wand-config.ts';
import { NoitaMaterial } from '../common/noita-material.ts';
import { NoitaMaterialReaction } from '../common/noita-material-reaction.ts';
import { NoitaScrapedEnemy } from './noita-scraped-enemy.ts';
import { NoitaScrapedGifWrapper } from './noita-scraped-gif-wrapper.ts';

export interface NoitaDataWakScrapeResult {
  translations: NoitaDataWakScrapeResultPart<
    StringKeyDictionary<NoitaTranslation>
  >;
  spells: NoitaDataWakScrapeResultPart<NoitaSpell[]>;
  perks: NoitaDataWakScrapeResultPart<NoitaPerk[]>;
  enemies: NoitaDataWakScrapeResultPart<NoitaScrapedEnemy[]>;
  enemyGifs: NoitaDataWakScrapeResultPart<
    StringKeyDictionary<NoitaScrapedGifWrapper>
  >;
  orbGifs: NoitaDataWakScrapeResultPart<
    StringKeyDictionary<NoitaScrapedGifWrapper>
  >;
  wandConfigs: NoitaDataWakScrapeResultPart<NoitaWandConfig[]>;
  materials: NoitaDataWakScrapeResultPart<NoitaMaterial[]>;
  materialReactions: NoitaDataWakScrapeResultPart<NoitaMaterialReaction[]>;
}
