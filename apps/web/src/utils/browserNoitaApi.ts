import { NoitaAPI } from '@noita-explorer/model';
import { localStorageConfig } from './localstorage-config.ts';
import { resolveCallbackPromise, resolvePromise } from '@noita-explorer/tools';

export function browserNoitaApi(): NoitaAPI {
  const config = localStorageConfig();

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
        scrapeProgressFlags: throwNotAllowedInThisModeError,
        scrapeEnemyStatistics: throwNotAllowedInThisModeError,
      },
    },
    dialog: {
      openFileDialog: throwNotAllowedInThisModeError,
      openFolderDialog: throwNotAllowedInThisModeError,
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
