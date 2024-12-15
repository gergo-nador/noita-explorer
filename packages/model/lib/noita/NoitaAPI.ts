import { NoitaWakData } from './scraping/NoitaWakData';
import { ImportResult } from './scraping/ImportResult.ts';
import { StringKeyDictionary } from '../common/StringKeyDictionary.ts';
import { EnemyStatistic } from './scraping/EnemyStatistics.ts';
import { NoitaProgressFlags } from './scraping/NoitaProgressFlags.ts';

export interface NoitaAPI {
  config: {
    get: (key: string) => Promise<string>;
    set: ({ key, value }: { key: string; value: string }) => Promise<void>;
  };
  noita: {
    dataFile: {
      exists: () => Promise<boolean>;
      get: () => Promise<NoitaWakData>;
      write: (obj: NoitaWakData) => Promise<void>;
      scrape: () => Promise<ImportResult>;
    };
    defaultPaths: {
      installPathDefault: () => Promise<string | undefined>;
      nollaGamesNoitaDefault: () => Promise<string | undefined>;
    };
    save00: {
      scrapeEnemyStatistics: () => Promise<StringKeyDictionary<EnemyStatistic>>;
      scrapeProgressFlags: () => Promise<NoitaProgressFlags>;
    };
  };
  dialog: {
    openFolderDialog: (args?: {
      startIn?: string;
      title?: string;
    }) => Promise<string | undefined>;

    openFileDialog: (args?: {
      startIn?: string;
      title?: string;
    }) => Promise<string | undefined>;

    openExplorer: (path: string) => Promise<boolean>;
  };
  /*path: {
    exist: (path: string) => Promise<boolean>;
    join: (paths: string[]) => Promise<string>;
  };*/
  clipboard: {
    get: () => Promise<string>;
    set: (text: string) => Promise<void>;
  };
  environment: {
    web: boolean;
    desktop:
      | {
          isMacOs: boolean;
          isLinux: boolean;
          isWindows: boolean;
        }
      | undefined;
  };
}
