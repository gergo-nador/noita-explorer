import { NoitaAPI } from '@noita-explorer/model';
import { idbKeyValConfig, localStorageStore } from './localstorage-config.ts';
import { resolveCallbackPromise, resolvePromise } from '@noita-explorer/tools';
import {
  scrapeEnemyStatistics,
  scrapeProgressFlags,
  scrapeSessions,
} from '@noita-explorer/scrapers';
import { FileSystemFolderBrowserWeb } from './FileSystemWeb.ts';
import { useToast } from '@noita-explorer/noita-component-library';

export function browserNoitaApi(): NoitaAPI {
  const config = localStorageStore();
  const fileAccessConfig = idbKeyValConfig<
    FileSystemFileHandle | FileSystemDirectoryHandle
  >();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const toast = useToast();

  const getSave00FolderHandle = async () => {
    const nollaGamesNoitaFolder = config.get('settings.paths.NollaGamesNoita');

    if (nollaGamesNoitaFolder === undefined) {
      toast.error('NollaGamesNoita folder is not set');
      throw new Error('NollaGamesNoita folder is not set');
    }

    const nollaGamesNoitaBrowserHandle = await fileAccessConfig.get(
      nollaGamesNoitaFolder,
    );
    if (nollaGamesNoitaBrowserHandle?.kind !== 'directory') {
      toast.error('NollaGamesNoita folder is not a directory');
      throw new Error('NollaGamesNoita folder is not a directory');
    }

    const save00BrowserHandle =
      await nollaGamesNoitaBrowserHandle.getDirectoryHandle('save00');

    return FileSystemFolderBrowserWeb(save00BrowserHandle);
  };

  return {
    config: {
      get: (key) => {
        return new Promise((resolve, reject) => {
          const result = config.get(key);
          if (result !== undefined) {
            resolve(result);
          } else {
            reject();
          }
        });
      },
      set: ({ key, value }) =>
        resolveCallbackPromise(() => config.set(key, value)),
    },
    noita: {
      defaultPaths: {
        installPathDefault: throwNotAllowedInThisModeError,
        nollaGamesNoitaDefault: throwNotAllowedInThisModeError,
      },
      dataFile: {
        get: () => fetch('/noita_wak_data.json').then((r) => r.json()),
        exists: () => resolvePromise(true),
        write: throwNotAllowedInThisModeError,
        scrape: throwNotAllowedInThisModeError,
      },
      save00: {
        scrapeProgressFlags: async () => {
          const api = await getSave00FolderHandle();
          return scrapeProgressFlags({ save00BrowserApi: api });
        },
        scrapeEnemyStatistics: async () => {
          const api = await getSave00FolderHandle();
          return await scrapeEnemyStatistics({ save00BrowserApi: api });
        },
        scrapeSessions: async () => {
          const api = await getSave00FolderHandle();
          return await scrapeSessions({ save00BrowserApi: api });
        },
      },
    },
    dialog: {
      openFileDialog: async () => {
        if (
          !('showOpenFilePicker' in window) ||
          typeof window.showOpenFilePicker !== 'function'
        ) {
          toast.error('This browser does not support file access.');
          return;
        }

        const fileHandle = await window.showOpenFilePicker();
        await fileAccessConfig.set(fileHandle.name, fileHandle);
        return fileHandle.name;
      },
      openFolderDialog: async () => {
        if (
          !('showDirectoryPicker' in window) ||
          typeof window.showDirectoryPicker !== 'function'
        ) {
          toast.error('This browser does not support file access.');
          return;
        }

        const dirHandle = await window.showDirectoryPicker();
        await fileAccessConfig.set(dirHandle.name, dirHandle);
        return dirHandle.name;
      },
      openExplorer: throwNotAllowedInThisModeError,
    },
    environment: {
      web: true,
      desktop: undefined,
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
