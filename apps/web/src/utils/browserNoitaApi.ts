import { NoitaAPI } from '@noita-explorer/model';
import { localStorageConfig } from './localstorage-config.ts';

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
      set: ({ key, value }) => config.set(key, value),
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
