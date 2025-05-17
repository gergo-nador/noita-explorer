import { NoitaWakData } from '../scraping/noita-wak-data.ts';
import { NoitaDataWakScrapeResult } from '../scraping/noita-data-wak-scrape-result.ts';
import { StringKeyDictionary } from '@noita-explorer/model';
import { EnemyStatistic } from '../scraping/enemy-statistics.ts';
import { NoitaProgressFlags } from '../scraping/noita-progress-flags.ts';
import { NoitaSession } from './noita-session.ts';
import { NoitaWorldState } from './noita-world-state.ts';
import { NoitaWandBonesFile } from './noita-wand-bones-file.ts';
import { NoitaAction, NoitaActionResult } from './noita-action.ts';

export interface NoitaApi {
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
    actions: {
      runActions: (actions: NoitaAction[]) => Promise<NoitaActionResult[]>;
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
    web:
      | {
          isFileSystemApiSupported: boolean;
          isFileSystemApiUnSupported: boolean;
        }
      | undefined;
    desktop:
      | {
          isMacOs: boolean;
          isLinux: boolean;
          isWindows: boolean;
        }
      | undefined;

    features: {
      bonesWandDelete: boolean;
    };
  };
}
