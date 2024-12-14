import { NoitaTranslation } from './scraping/NoitaTranslation';

export interface NoitaTranslationsModel {
  getTranslation: (id: string) => NoitaTranslation | undefined;
  tryGetTranslation: (id: string) => {
    exists: boolean;
    translation: NoitaTranslation | undefined;
  };
}
