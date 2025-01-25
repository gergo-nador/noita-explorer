import { NoitaEnemy } from '../common/NoitaEnemy.ts';
import { NoitaPerk } from '../common/NoitaPerk.ts';
import { NoitaSpell } from '../common/NoitaSpell.ts';
import { NoitaTranslation } from './NoitaTranslation.ts';
import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaWandConfig } from '../common/NoitaWandConfig.ts';
import { NoitaMaterial } from '../common/NoitaMaterial.ts';
import { NoitaMaterialReaction } from '../common/NoitaMaterialReaction.ts';

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
}
