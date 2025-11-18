import { NoitaPerk } from '../common/noita-perk.ts';
import { NoitaSpell } from '../common/spell/noita-spell.ts';
import { NoitaTranslation } from './noita-translation.ts';
import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaWandConfig } from '../common/wand/noita-wand-config.ts';
import { NoitaMaterial } from '../common/noita-material.ts';
import { NoitaMaterialReaction } from '../common/noita-material-reaction.ts';
import { NoitaEnemy } from '../common/enemy/noita-enemy.ts';
import { NoitaWakBiomes } from '../common/biomes/noita-wak-biomes.ts';
import { DataWakMediaIndex } from './data-wak/media/data-wak-media-index.ts';

export interface NoitaWakData {
  scrapedAt: string;
  scrapedAtUnix: number;
  version: number;

  enemies: NoitaEnemy[];
  perks: NoitaPerk[];
  spells: NoitaSpell[];
  wandConfigs: NoitaWandConfig[];
  translations: StringKeyDictionary<NoitaTranslation>;
  materials: NoitaMaterial[];
  materialReactions: NoitaMaterialReaction[];
  biomes: NoitaWakBiomes;
  mediaIndex: StringKeyDictionary<DataWakMediaIndex>;
}
