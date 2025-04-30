import { create } from 'zustand';
import { noitaAPI } from '../ipcHandlers';

export type SettingsUnitsType = 'default' | 'frames' | 'seconds';
export type SettingsCursorType = 'default' | 'noita-cursor' | 'wand';
export type SettingsNoitaCursorType =
  | 'mouse_cursor_big'
  | 'mouse_cursor_big_system';

export interface Settings {
  paths: {
    // noita install folder path
    install: string | undefined;
    // master data folder for noita saves
    NollaGamesNoita: string | undefined;
  };
  units: {
    time: SettingsUnitsType;
  };
  cursor: {
    type: SettingsCursorType;
    noitaCursor: SettingsNoitaCursorType;
    wandSpriteId: string | undefined;
  };
  progressDisplayDebugData: boolean;
  spoilerWarningAccepted: boolean;
}

export interface SettingsState {
  settings: Settings;
  loaded: boolean;
  load: () => Promise<void>;
  set: (callback: (state: Settings) => void) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {
    paths: {
      install: undefined,
      NollaGamesNoita: undefined,
    },
    units: {
      time: 'default',
    },
    cursor: {
      type: 'default',
      noitaCursor: 'mouse_cursor_big',
      wandSpriteId: undefined,
    },
    progressDisplayDebugData: false,
    spoilerWarningAccepted: false,
  },

  loaded: false,
  load: async () => {
    try {
      const state = get();

      let settings = state.settings;
      settings = await loadSettings(settings);
      // make a deep copy to trigger updates
      settings = JSON.parse(JSON.stringify(settings));

      // reset file paths if the new file access api is not supported
      if (noitaAPI.environment.web?.isFileSystemApiUnSupported) {
        settings.paths = {
          install: undefined,
          NollaGamesNoita: undefined,
        };
      }

      return set({ ...state, settings: settings, loaded: true });
    } catch (err) {
      console.error('Failed to load settings: ', err);
    }
  },
  set: (callback) => {
    const state = get();
    const settings = JSON.parse(JSON.stringify(state.settings));
    callback(settings);
    set({ ...state, settings: settings });

    saveSettings(settings).catch((err) =>
      console.error('Failed to save settings: ', err),
    );
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
      noitaAPI.config.set({ key: currentPath, value: value });
    }
  }
}
