import { NoitaWakData } from './scraping/NoitaWakData';
import { ImportResult } from './scraping/ImportResult';
import { EnemyStatistic } from './scraping/EnemyStatistics';
import { StringKeyDictionary } from '../common/StringKeyDictionary';

export interface NoitaAPI {
  config: {
    get: (key: string) => Promise<string>;
    set: ({ key, value }: { key: string; value: string }) => void;
  };
  noita: {
    dataFile: {
      exists: () => Promise<boolean>;
      get: () => Promise<NoitaWakData>;
      scrape: () => Promise<ImportResult>;
      write: (obj: NoitaWakData) => Promise<void>;
    };
    defaultPaths: {
      installPathDefault: () => Promise<string | undefined>;
      nollaGamesNoitaDefault: () => Promise<string | undefined>;
    };
    save00: {
      getEnemyStatistics: () => Promise<{
        enemies: StringKeyDictionary<EnemyStatistic>;
      }>;
      readFlags: () => Promise<{ spells: string[]; perks: string[] }>;
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
  path: {
    exist: (path: string) => Promise<boolean>;
    join: (paths: string[]) => Promise<string>;
  };
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
