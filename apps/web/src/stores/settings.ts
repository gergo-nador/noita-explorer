import { create } from 'zustand';
import { noitaAPI } from '../ipcHandlers';
import { supported } from 'browser-fs-access';

export interface SettingsState {
  paths: {
    // noita install folder path
    install: string | undefined;
    // master data folder for noita saves
    NollaGamesNoita: string | undefined;
  };
  units: {
    time: 'default' | 'frames' | 'seconds';
  };
  loaded: boolean;
  load: () => Promise<void>;
  set: (callback: (state: SettingsState) => void) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  paths: {
    install: undefined,
    NollaGamesNoita: undefined,
  },
  units: {
    time: 'default',
  },

  loaded: false,
  load: async () => {
    try {
      const state = await loadSettings(get());
      if (!supported) {
        state.paths = {
          install: undefined,
          NollaGamesNoita: undefined,
        };
      }

      return set({ ...state, loaded: true });
    } catch (err) {
      console.error('Failed to load settings: ', err);
    }
  },
  set: (callback) => {
    const state = get();
    callback(state);
    set({ ...state });

    saveSettings(state).catch((err) =>
      console.error('Failed to save settings: ', err),
    );
  },
}));

async function loadSettings(state: SettingsState): Promise<SettingsState> {
  await loadSettingsRecursive({
    path: 'settings.paths',
    obj: state.paths,
  });
  await loadSettingsRecursive({
    path: 'settings.units',
    obj: state.units,
  });

  return state;
}

async function loadSettingsRecursive({
  path,
  obj,
}: {
  path: string;
  obj: object;
}) {
  for (const key in obj) {
    const currentPath = path + '.' + key;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const value = obj[key];

    if (typeof value === 'object') {
      await loadSettingsRecursive({
        path: currentPath,
        obj: value,
      });

      continue;
    }

    const result = await noitaAPI.config.get(currentPath);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    obj[key] = result ?? obj[key];
  }
}

async function saveSettings(state: SettingsState): Promise<void> {
  await saveSettingsRecursive({ path: 'settings.paths', obj: state.paths });
  await saveSettingsRecursive({ path: 'settings.units', obj: state.units });
}

async function saveSettingsRecursive({
  path,
  obj,
}: {
  path: string;
  obj: object;
}) {
  for (const key in obj) {
    const currentPath = path + '.' + key;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const value = obj[key];

    if (typeof value === 'object') {
      await saveSettingsRecursive({
        path: currentPath,
        obj: value,
      });

      continue;
    }

    if (value !== undefined) {
      noitaAPI.config.set({ key: currentPath, value: value });
    }
  }
}
