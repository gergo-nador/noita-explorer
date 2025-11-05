import { create } from 'zustand';
import { noitaAPI } from '../utils/noita-api.ts';
import { sentry } from '../utils/sentry.ts';
import { objectHelpers } from '@noita-explorer/tools';

export type SettingsUnitsType = 'default' | 'frames' | 'seconds';
export type SettingsCursorType = 'default' | 'noita-cursor' | 'wand';
export type SettingsNoitaCursorType =
  | 'mouse_cursor_big'
  | 'mouse_cursor_big_system';
export type SettingsMapWorkerAmountType = 'auto' | 'custom';

export interface Settings {
  paths: {
    // noita install folder path
    install: string | undefined;
    // master data folder for noita saves
    save00: string | undefined;
    forceReloadSave00Counter: number;
  };
  units: {
    time: SettingsUnitsType;
  };
  cursor: {
    type: SettingsCursorType;
    noitaCursor: SettingsNoitaCursorType;
    wandSpriteId: string | undefined;
  };
  map: {
    initialPopupSeen: boolean;
    customWorkerCount: number;
    workerAmountType: SettingsMapWorkerAmountType;
  };
  progressDisplayDebugData: boolean;
  sentry: {
    enabled: boolean;
    initialPopupSeen: boolean;
  };
  noMobileSupportAccepted: boolean;
}

export interface SettingsState {
  settings: Settings;
  loaded: boolean;
  load: () => Promise<void>;
  set: (
    callback: (state: Settings) => void,
    options?: {
      /**
       * WARNING: Setting this true will persist the settings
       * for the next page refresh but will not update the current state.
       *
       * Use this when a page refresh is needed immediately after settings some settings.
       */
      skipUpdateState: boolean;
    },
  ) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {
    paths: {
      install: undefined,
      save00: undefined,
      forceReloadSave00Counter: 0,
    },
    units: {
      time: 'default',
    },
    cursor: {
      type: 'default',
      noitaCursor: 'mouse_cursor_big',
      wandSpriteId: undefined,
    },
    map: {
      initialPopupSeen: false,
      workerAmountType: 'custom',
      customWorkerCount: Math.min(4, navigator.hardwareConcurrency),
    },
    progressDisplayDebugData: false,
    sentry: {
      enabled: false,
      initialPopupSeen: false,
    },
    noMobileSupportAccepted: false,
  },

  loaded: false,
  load: async () => {
    try {
      const state = get();

      let settings = state.settings;
      settings = await loadSettings(settings);
      settings = objectHelpers.deepCopy(settings);

      // reset file paths if the new file access api is not supported
      if (noitaAPI.environment.web?.isFileSystemApiUnSupported) {
        settings.paths = {
          install: undefined,
          save00: undefined,
          forceReloadSave00Counter: 0,
        };
      }

      sentry.setNextStartup(settings.sentry.enabled);

      return set({ ...state, settings: settings, loaded: true });
    } catch (err) {
      console.error('Failed to load settings: ', err);
    }
  },
  set: (callback, options) => {
    const state = get();
    const settings: Settings = JSON.parse(JSON.stringify(state.settings));
    callback(settings);

    if (state.settings.sentry.enabled !== settings.sentry.enabled) {
      sentry.setNextStartup(settings.sentry.enabled);
    }

    return saveSettings(settings)
      .catch((err) => console.error('Failed to save settings: ', err))
      .then(() => {
        if (options?.skipUpdateState) return;
        set({ ...state, settings: settings });
      });
  },
}));

async function loadSettings(settings: Settings): Promise<Settings> {
  await loadSettingsRecursive({
    path: 'settings',
    obj: settings,
  });

  return settings;
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

async function saveSettings(settings: Settings): Promise<void> {
  await saveSettingsRecursive({ path: 'settings', obj: settings });
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
      await noitaAPI.config.set({ key: currentPath, value: value });
    }
  }
}
