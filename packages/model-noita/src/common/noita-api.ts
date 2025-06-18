import { NoitaWakData } from '../scraping/noita-wak-data.ts';
import { NoitaDataWakScrapeResult } from '../scraping/noita-data-wak-scrape-result.ts';
import { StringKeyDictionary } from '@noita-explorer/model';
import { EnemyStatistic } from '../scraping/enemy-statistics.ts';
import { NoitaProgressFlags } from '../scraping/noita-progress-flags.ts';
import { NoitaSession } from './noita-session.ts';
import { NoitaWorldState } from './noita-world-state.ts';
import { NoitaWandBonesFile } from './wand/noita-wand-bones-file.ts';
import { NoitaPlayerState } from './entity/player/noita-player-state.ts';
import { NoitaAction } from './actions/noita-action.ts';
import { NoitaActionProgress } from './actions/noita-action-progress.ts';
import { NoitaActionResult } from './actions/noita-action-result.ts';

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
      scrapePlayerState: () => Promise<NoitaPlayerState | undefined>;
      scrapeOrbsUnlocked: () => Promise<string[]>;
    };
    launch: {
      master: (params?: string[]) => Promise<void>;
    };
    actions: {
      runActions: (
        actions: NoitaAction[],
        callback: (progress: NoitaActionProgress) => void,
      ) => Promise<NoitaActionResult[]>;
      getNumberOfActionsRan: () => Promise<number>;
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
      launchGame: boolean;
      progressUnlockMode: boolean;
    };
  };
}
