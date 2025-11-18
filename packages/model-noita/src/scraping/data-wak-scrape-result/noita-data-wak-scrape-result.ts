import { NoitaDataWakScrapeResultPart } from './noita-data-wak-scrape-result-part.ts';
import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaTranslation } from '../noita-translation.ts';
import { NoitaMaterialReaction } from '../../common/noita-material-reaction.ts';
import { NoitaScrapedEnemy } from '../data-wak/enemy/noita-scraped-enemy.ts';
import {
  NoitaScrapedMedia,
  NoitaScrapedMediaGif,
} from '../data-wak/media/noita-scraped-media.ts';
import { NoitaScrapedSpell } from '../data-wak/spell/noita-scraped-spell.ts';
import { NoitaScrapedPerk } from '../data-wak/perk/noita-scraped-perk.ts';
import { NoitaScrapedMaterial } from '../data-wak/material/noita-scraped-material.ts';
import { NoitaScrapedWandConfig } from '../data-wak/wand/noita-scraped-wand-config.ts';
import { NoitaWakBiomes } from '../../common/biomes/noita-wak-biomes.ts';
import { DataWakMediaIndex } from '../data-wak/media/data-wak-media-index.ts';

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
  wandConfigs: NoitaDataWakScrapeResultPart<NoitaScrapedWandConfig[]>;
  materials: NoitaDataWakScrapeResultPart<NoitaScrapedMaterial[]>;
  materialReactions: NoitaDataWakScrapeResultPart<NoitaMaterialReaction[]>;
  biomes: NoitaDataWakScrapeResultPart<NoitaWakBiomes>;
  mediaIndex: NoitaDataWakScrapeResultPart<
    StringKeyDictionary<DataWakMediaIndex>
  >;
}
