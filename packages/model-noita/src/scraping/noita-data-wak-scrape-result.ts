import { NoitaDataWakScrapeResultPart } from './noita-data-wak-scrape-result-part.ts';
import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaTranslation } from './noita-translation.ts';
import { NoitaWandConfig } from '../common/wand/noita-wand-config.ts';
import { NoitaMaterialReaction } from '../common/noita-material-reaction.ts';
import { NoitaScrapedEnemy } from './noita-scraped-enemy.ts';
import {
  NoitaScrapedMedia,
  NoitaScrapedMediaGif,
} from './noita-scraped-media.ts';
import { NoitaScrapedSpell } from './noita-scraped-spell.ts';
import { NoitaScrapedPerk } from './noita-scraped-perk.ts';
import { NoitaScrapedMaterial } from './noita-scraped-material.ts';

export interface NoitaDataWakScrapeResult {
  translations: NoitaDataWakScrapeResultPart<
    StringKeyDictionary<NoitaTranslation>
  >;
  spells: NoitaDataWakScrapeResultPart<NoitaScrapedSpell[]>;
  perks: NoitaDataWakScrapeResultPart<NoitaScrapedPerk[]>;
  enemies: NoitaDataWakScrapeResultPart<NoitaScrapedEnemy[]>;
  enemyMedia: NoitaDataWakScrapeResultPart<
    StringKeyDictionary<NoitaScrapedMedia>
  >;
  orbGifs: NoitaDataWakScrapeResultPart<
    StringKeyDictionary<NoitaScrapedMediaGif>
  >;
  wandConfigs: NoitaDataWakScrapeResultPart<NoitaWandConfig[]>;
  materials: NoitaDataWakScrapeResultPart<NoitaScrapedMaterial[]>;
  materialReactions: NoitaDataWakScrapeResultPart<NoitaMaterialReaction[]>;
}
