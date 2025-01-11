import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import { NoitaAPI } from '@noita-explorer/model-noita';
import { promiseHelper } from '@noita-explorer/tools';
import {
  scrapeBonesWands,
  scrapeEnemyStatistics,
  scrapeProgressFlags,
  scrapeSessions,
} from '@noita-explorer/scrapers';
import { FileSystemDirectoryAccessBrowserApi } from '@noita-explorer/file-systems/browser-file-access-api';
import { FileSystemDirectoryAccessBrowserFallback } from '@noita-explorer/file-systems/browser-fallback';
import { useToast } from '@noita-explorer/noita-component-library';
import { noitaDb } from './databases.ts';
import {
  supported,
  directoryOpen,
  FileWithDirectoryAndFileHandle,
} from 'browser-fs-access';

export function browserNoitaApi(): NoitaAPI {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const toast = useToast();

  const getSave00FolderHandle = async () => {
    const db = await noitaDb;
    const config = db.config;

    const nollaGamesNoitaFolder = await config.get(
      'settings.paths.NollaGamesNoita',
    );

    if (nollaGamesNoitaFolder === undefined) {
      throw new Error('NollaGamesNoita folder is not set');
    }

    if (!supported) {
      const handle = fallbackFolderStorage[nollaGamesNoitaFolder];
      if (handle === undefined) {
        throw new Error('NollaGamesNoita folder is not set');
      }

      return handle.getDirectory('save00');
    }

    const fileAccessConfig = db.fileAccess;
    const nollaGamesNoitaBrowserHandle = await fileAccessConfig.get(
      nollaGamesNoitaFolder,
    );
    if (nollaGamesNoitaBrowserHandle?.kind !== 'directory') {
      throw new Error('NollaGamesNoita folder is not a directory');
    }

    const save00BrowserHandle =
      await nollaGamesNoitaBrowserHandle.getDirectoryHandle('save00');

    return FileSystemDirectoryAccessBrowserApi(save00BrowserHandle);
  };

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
        nollaGamesNoitaDefault: throwNotAllowedInThisModeError,
      },
      dataFile: {
        get: () => fetch('/noita_wak_data.json').then((r) => r.json()),
        exists: () => promiseHelper.fromValue(true),
        write: throwNotAllowedInThisModeError,
        scrape: throwNotAllowedInThisModeError,
      },
      save00: {
        scrapeProgressFlags: async () => {
          const api = await getSave00FolderHandle();
          return scrapeProgressFlags({ save00DirectoryApi: api });
        },
        scrapeEnemyStatistics: async () => {
          const api = await getSave00FolderHandle();
          return await scrapeEnemyStatistics({ save00DirectoryApi: api });
        },
        scrapeSessions: async () => {
          const api = await getSave00FolderHandle();
          return await scrapeSessions({ save00DirectoryApi: api });
        },
        scrapeBonesWands: async () => {
          const api = await getSave00FolderHandle();
          return await scrapeBonesWands({ save00DirectoryApi: api });
        },
      },
      launch: {
        master: () => throwNotAllowedInThisModeError(),
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

        const db = await noitaDb;
        const fileAccessConfig = db.fileAccess;

        const fileHandle = await window.showOpenFilePicker();
        await fileAccessConfig.set(fileHandle.name, fileHandle);
        return fileHandle.name;
      },
      openFolderDialog: async (props) => {
        if (!supported) {
          return await openFolderDialogFallback(props?.id);
        }

        return await openFolderDialogFileAccessApi();
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
