import { NoitaWakData } from '../scraping/NoitaWakData';
import { NoitaDataWakScrapeResult } from '../scraping/NoitaDataWakScrapeResult.ts';
import { StringKeyDictionary } from '@noita-explorer/model';
import { EnemyStatistic } from '../scraping/EnemyStatistics.ts';
import { NoitaProgressFlags } from '../scraping/NoitaProgressFlags.ts';
import { NoitaSession } from './NoitaSession.ts';
import { NoitaWorldState } from './NoitaWorldState.ts';
import { NoitaWandBonesFile } from './NoitaWandBonesFile.ts';

export interface NoitaAPI {
  config: {
    get: (key: string) => Promise<string | undefined>;
    set: ({ key, value }: { key: string; value: string }) => Promise<void>;
  };
  noita: {
    dataFile: {
      exists: () => Promise<boolean>;
      get: () => Promise<NoitaWakData>;
      write: (obj: NoitaWakData) => Promise<void>;
      scrape: () => Promise<NoitaDataWakScrapeResult>;
    };
    defaultPaths: {
      installPathDefault: () => Promise<string | undefined>;
      nollaGamesNoitaDefault: () => Promise<string | undefined>;
    };
    save00: {
      scrapeEnemyStatistics: () => Promise<StringKeyDictionary<EnemyStatistic>>;
      scrapeProgressFlags: () => Promise<NoitaProgressFlags>;
      scrapeSessions: () => Promise<NoitaSession[]>;
      scrapeBonesWands: () => Promise<NoitaWandBonesFile[]>;
      scrapeWorldState: () => Promise<NoitaWorldState | undefined>;
    };
    launch: {
      master: (params?: string[]) => Promise<void>;
    };
  };
  dialog: {
    openFolderDialog: (args?: {
      startIn?: string;
      title?: string;
      id?: string;
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
