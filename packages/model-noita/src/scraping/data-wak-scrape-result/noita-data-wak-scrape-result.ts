import { NoitaDataWakScrapeResultPart } from './noita-data-wak-scrape-result-part.ts';
import { ImagePngDimension, StringKeyDictionary } from '@noita-explorer/model';
import { NoitaTranslation } from '../noita-translation.ts';
import { NoitaMaterialReaction } from '../../common/noita-material-reaction.ts';
import { NoitaScrapedEnemy } from '../data-wak/noita-scraped-enemy.ts';
import {
  NoitaScrapedMedia,
  NoitaScrapedMediaGif,
} from '../data-wak/noita-scraped-media.ts';
import { NoitaScrapedSpell } from '../data-wak/noita-scraped-spell.ts';
import { NoitaScrapedPerk } from '../data-wak/noita-scraped-perk.ts';
import { NoitaScrapedMaterial } from '../data-wak/noita-scraped-material.ts';
import { NoitaScrapedWandConfig } from '../data-wak/noita-scraped-wand-config.ts';
import { NoitaWakBiomes } from '../../common/biomes/noita-wak-biomes.ts';

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
  mediaDimensions: NoitaDataWakScrapeResultPart<
    StringKeyDictionary<ImagePngDimension>
  >;
}
