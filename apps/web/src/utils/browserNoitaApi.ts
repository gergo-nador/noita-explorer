import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import {
  NoitaAction,
  NoitaActionResult,
  NoitaAPI,
} from '@noita-explorer/model-noita';
import { promiseHelper } from '@noita-explorer/tools';
import { scrape, actions } from '@noita-explorer/scrapers';
import { FileSystemDirectoryAccessBrowserApi } from '@noita-explorer/file-systems/browser-file-access-api';
import { FileSystemDirectoryAccessBrowserFallback } from '@noita-explorer/file-systems/browser-fallback';
import { noitaDb } from './databases.ts';
import {
  supported as hasFileSystemApi,
  directoryOpen,
  FileWithDirectoryAndFileHandle,
} from 'browser-fs-access';
import { noiToast } from '@noita-explorer/noita-component-library';

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
          return scrape.progressFlags({ save00DirectoryApi: api });
        },
        scrapeEnemyStatistics: async () => {
          const api = await getSave00FolderHandle();
          return await scrape.enemyStatistics({ save00DirectoryApi: api });
        },
        scrapeSessions: async () => {
          const api = await getSave00FolderHandle();
          return await scrape.sessions({ save00DirectoryApi: api });
        },
        scrapeBonesWands: async () => {
          const api = await getSave00FolderHandle();
          return await scrape.bonesWands({ save00DirectoryApi: api });
        },
        scrapeWorldState: async () => {
          const api = await getSave00FolderHandle();
          return await scrape.worldState({ save00DirectoryApi: api });
        },
      },
      launch: {
        master: () => throwNotAllowedInThisModeError(),
      },
      actions: {
        runActions: runActions,
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

const getSave00FolderHandle = async () => {
  const db = await noitaDb;
  const config = db.config;

  const nollaGamesNoitaFolder = await config.get(
    'settings.paths.NollaGamesNoita',
  );

  if (nollaGamesNoitaFolder === undefined) {
    throw new Error('NollaGamesNoita folder is not set');
  }

  if (!hasFileSystemApi) {
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

const runActions = async (
  noitaActions: NoitaAction[],
): Promise<NoitaActionResult[]> => {
  const save00FolderHandle = await getSave00FolderHandle();
  const results: NoitaActionResult[] = [];

  for (const action of noitaActions) {
    try {
      if (action.type === 'bones-wand-delete') {
        await actions.deleteBonesWands({
          save00DirectoryApi: save00FolderHandle,
          bonesWandFileName: action.payload.bonesFileName,
        });
      } else if (action.type === 'unlock-perk') {
        await actions.unlockPerk({
          save00DirectoryApi: save00FolderHandle,
          perkId: action.payload.perkId,
        });
      } else if (action.type === 'unlock-spell') {
        await actions.unlockSpell({
          save00DirectoryApi: save00FolderHandle,
          spellId: action.payload.spellId,
        });
      } else {
        console.error(
          action,
          'not implemented in "actions-run-all-button.tsx"',
        );
      }

      results.push({ type: 'success', action: action });
    } catch (e) {
      results.push({ type: 'error', action: action, error: e as Error });
    }
  }

  return results;
};
