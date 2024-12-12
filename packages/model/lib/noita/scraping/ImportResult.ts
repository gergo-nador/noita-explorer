import { NoitaSpell } from '../NoitaSpell';
import { ImportResultStatus } from './ImportResultStatus';
import { NoitaPerk } from '../NoitaPerk';
import { NoitaEnemy } from '../NoitaEnemy';
import { ImportResultPart } from './ImportResultPart';

export interface ImportResult {
  translations: {
    status: ImportResultStatus;
    error?: {
      message: string;
      errorData: object | unknown;
    };
  };
  spells: ImportResultPart<NoitaSpell[]>;
  perks: ImportResultPart<NoitaPerk[]>;
  enemies: ImportResultPart<NoitaEnemy[]>;
}
