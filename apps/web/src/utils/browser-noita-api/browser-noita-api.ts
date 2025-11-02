import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import { NoitaAPI } from '@noita-explorer/model-noita';
import { promiseHelper } from '@noita-explorer/tools';
import { scrape } from '@noita-explorer/scrapers';
import { FileSystemDirectoryAccessBrowserApi } from '@noita-explorer/file-systems/browser-file-access-api';
import { FileSystemDirectoryAccessBrowserFallback } from '@noita-explorer/file-systems/browser-fallback';
import { noitaDb } from '../databases.ts';
import {
  supported as hasFileSystemApi,
  directoryOpen,
  FileWithDirectoryAndFileHandle,
} from 'browser-fs-access';
import { noiToast } from '@noita-explorer/noita-component-library';
import { runActions } from './run-actions.ts';
import { fastLzCompressorService } from '../fast-lz-compressor-service.ts';
import { fetchDataWak } from './fetch-data-wak.ts';

export function browserNoitaApi(): NoitaAPI {
  return {
    config: {
      get: async (key) => {
        const db = await noitaDb;
        const config = db.config;

        return await config.get(key);
      },
      set: async ({ key, value }) => {
        const db = await noitaDb;
        const config = db.config;

        await config.set(key, value);
      },
    },
    noita: {
      defaultPaths: {
        installPathDefault: throwNotAllowedInThisModeError,
        save00Default: throwNotAllowedInThisModeError,
      },
      dataFile: {
        get: () => {
          return fetchDataWak();
        },
        exists: () => promiseHelper.fromValue(true),
        write: throwNotAllowedInThisModeError,
        scrape: throwNotAllowedInThisModeError,
      },
      save00: {
        scrapeProgressFlags: async () => {
          const api = await getSave00FolderHandle();
          return scrape.save00.progressFlags({ save00DirectoryApi: api });
        },
        scrapeEnemyStatistics: async () => {
          const api = await getSave00FolderHandle();
          return await scrape.save00.enemyStatistics({
            save00DirectoryApi: api,
          });
        },
        scrapeSessions: async () => {
          const api = await getSave00FolderHandle();
          return await scrape.save00.sessions({ save00DirectoryApi: api });
        },
        scrapeBonesWands: async () => {
          const api = await getSave00FolderHandle();
          return await scrape.save00.bonesWands({ save00DirectoryApi: api });
        },
        scrapeWorldState: async () => {
          const api = await getSave00FolderHandle();
          return await scrape.save00.worldState({ save00DirectoryApi: api });
        },
        scrapePlayerState: async () => {
          const api = await getSave00FolderHandle();
          return await scrape.save00.playerState({ save00DirectoryApi: api });
        },
        scrapeOrbsUnlocked: async () => {
          const api = await getSave00FolderHandle();
          return await scrape.save00.orbsUnlocked({ save00DirectoryApi: api });
        },
        scrapeStreamInfo: async () => {
          const api = await getSave00FolderHandle();
          const fastLzCompressor = await fastLzCompressorService.get();

          return await scrape.save00.streamInfo({
            save00DirectoryApi: api,
            fastLzCompressor,
          });
        },
        scrapeWorldPixelScenes: async () => {
          const api = await getSave00FolderHandle();
          const fastLzCompressor = await fastLzCompressorService.get();

          return await scrape.save00.worldPixelScenes({
            save00DirectoryApi: api,
            fastLzCompressor,
          });
        },
      },
      launch: {
        master: () => throwNotAllowedInThisModeError(),
      },
      actions: {
        runActions: async (actions, callback) => {
          // update number of ran actions
          await noitaDb.then(async (db) => {
            const dbValue = await noitaDb.then((db) =>
              db.appData.get(db.appData.keys.numberOfActionsRan),
            );

            const value = typeof dbValue !== 'number' ? 0 : dbValue;
            await db.appData.set(
              db.appData.keys.numberOfActionsRan,
              value + actions.length,
            );
          });

          // run actions
          return runActions({
            noitaActions: actions,
            save00FolderHandle: await getSave00FolderHandle(),
            callback,
          });
        },
        getNumberOfActionsRan: async () => {
          const value = await noitaDb.then((db) =>
            db.appData.get(db.appData.keys.numberOfActionsRan),
          );

          if (typeof value !== 'number') {
            return 0;
          }

          return value as number;
        },
      },
    },
    dialog: {
      openFileDialog: async () => {
        if (
          !('showOpenFilePicker' in window) ||
          typeof window.showOpenFilePicker !== 'function'
        ) {
          noiToast.error('This browser does not support file access.');
          return;
        }

        const db = await noitaDb;
        const fileAccessConfig = db.fileAccess;

        const fileHandle = await window.showOpenFilePicker();
        await fileAccessConfig.set(fileHandle.name, fileHandle);
        return fileHandle.name;
      },
      openFolderDialog: async (props) => {
        if (!hasFileSystemApi) {
          return await openFolderDialogFallback(props?.id);
        }

        return await openFolderDialogFileAccessApi();
      },
      openExplorer: throwNotAllowedInThisModeError,
    },
    environment: {
      web: {
        isFileSystemApiSupported: hasFileSystemApi,
        isFileSystemApiUnSupported: !hasFileSystemApi,
      },
      desktop: undefined,
      features: {
        bonesWandDelete: hasFileSystemApi,
        launchGame: false,
        progressUnlockMode: hasFileSystemApi,
      },
    },
    clipboard: {
      get: () => navigator.clipboard.readText(),
      set: (text) => navigator.clipboard.writeText(text),
    },
  };
}

const throwNotAllowedInThisModeError = () => {
  throw new Error('This functionality is not allowed in this mode');
};

const openFolderDialogFileAccessApi = async () => {
  if (
    !('showDirectoryPicker' in window) ||
    typeof window.showDirectoryPicker !== 'function'
  ) {
    throw new Error('FileAccessApi is not accessible in this browser');
  }

  const db = await noitaDb;
  const fileAccessConfig = db.fileAccess;

  const dirHandle = await window.showDirectoryPicker();
  await fileAccessConfig.set(dirHandle.name, dirHandle);
  return dirHandle.name;
};

const fallbackFolderStorage: StringKeyDictionary<FileSystemDirectoryAccess> =
  {};
const openFolderDialogFallback = async (id: string | undefined) => {
  const handlers = (await directoryOpen({
    mode: 'read',
    recursive: true,
    id: id,
  })) as FileWithDirectoryAndFileHandle[];

  if (!handlers || !Array.isArray(handlers)) {
    throw new Error('Invalid directory handle or no files selected.');
  }

  const folder = FileSystemDirectoryAccessBrowserFallback(handlers);
  const name = folder.getName();

  fallbackFolderStorage[name] = folder;

  return name;
};

export const getSave00FolderHandle = async () => {
  const db = await noitaDb;
  const config = db.config;

  const save00Folder = await config.get('settings.paths.save00');

  if (save00Folder === undefined) {
    throw new Error('save00 folder is not set');
  }

  if (!hasFileSystemApi) {
    const handle = fallbackFolderStorage[save00Folder];
    if (handle === undefined) {
      throw new Error('save00 folder is not set');
    }

    return handle;
  }

  const fileAccessConfig = db.fileAccess;
  const save00BrowserHandle = await fileAccessConfig.get(save00Folder);
  if (save00BrowserHandle?.kind !== 'directory') {
    throw new Error('save00 folder is not a directory');
  }

  return FileSystemDirectoryAccessBrowserApi(save00BrowserHandle);
};
