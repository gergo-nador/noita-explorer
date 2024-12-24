import { NoitaSpell } from '../NoitaSpell';
import { NoitaPerk } from '../NoitaPerk';
import { NoitaEnemy } from '../NoitaEnemy';
import { ImportResultPart } from './ImportResultPart';
import { StringKeyDictionary } from '../../common/StringKeyDictionary';
import { NoitaTranslation } from './NoitaTranslation';

export interface ImportResult {
  translations: ImportResultPart<StringKeyDictionary<NoitaTranslation>>;
  spells: ImportResultPart<NoitaSpell[]>;
  perks: ImportResultPart<NoitaPerk[]>;
  enemies: ImportResultPart<NoitaEnemy[]>;
}
