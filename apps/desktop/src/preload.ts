// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { NoitaAPI } from '@noita-explorer/model-noita';
import { platformHelpers } from '@noita-explorer/tools';

const noitaApi: NoitaAPI = {
  config: {
    get: (args) => ipcRenderer.invoke('config:get', args),
    set: (args) => ipcRenderer.invoke('config:set', args),
  },
  noita: {
    dataFile: {
      exists: () => ipcRenderer.invoke('noita-data-file:is-ready'),
      get: () => ipcRenderer.invoke('noita-data-file:get'),
      write: (obj) => ipcRenderer.invoke('noita-data-file:write', obj),
      scrape: () => ipcRenderer.invoke('noita-data-file:scrape'),
    },
    defaultPaths: {
      installPathDefault: () =>
        ipcRenderer.invoke('noita-default-paths:install'),
      nollaGamesNoitaDefault: () =>
        ipcRenderer.invoke('noita-default-paths:nolla-games-noita'),
    },
    save00: {
      scrapeProgressFlags: () =>
        ipcRenderer.invoke('save00:scrape-progress-flags'),
      scrapeEnemyStatistics: () =>
        ipcRenderer.invoke('save00:scrape-enemy-statistics'),
      scrapeSessions: () => ipcRenderer.invoke('save00:scrape-sessions'),
      scrapeBonesWands: () => ipcRenderer.invoke('save00:scrape-bones-wands'),
      scrapeWorldState: () => ipcRenderer.invoke('save00:scrape-world-state'),
      scrapePlayerState: () => {
        throw new Error('scrapePlayerState not implemented in preload.ts');
      },
      scrapeOrbsUnlocked: () => {
        throw new Error('scrapeOrbsUnlocked not implemented in preload.ts');
      },
    },
    launch: {
      master: (args) => ipcRenderer.invoke('noita:launch-master', args),
    },
    actions: {
      runActions: (actions) => {
        throw new Error('runActions not implemented in preload.ts');
      },
      getNumberOfActionsRan: () => {
        throw new Error('getNumberOfActionsRan not implemented in preload.ts');
      },
    },
  },
  dialog: {
    openFolderDialog: (args) =>
      ipcRenderer.invoke('dialog:openDirectory', args),
    openFileDialog: (args) => ipcRenderer.invoke('dialog:openFile', args),
    openExplorer: (path: string) =>
      ipcRenderer.invoke('dialog:openExplorer', path),
  },
  clipboard: {
    get: () => ipcRenderer.invoke('clipboard:get'),
    set: (text) => ipcRenderer.invoke('clipboard:set', text),
  },
  environment: {
    web: undefined,
    desktop: {
      isMacOs: platformHelpers.isMacOs,
      isLinux: platformHelpers.isLinux,
      isWindows: platformHelpers.isWindows,
    },
    features: {
      bonesWandDelete: true,
      launchGame: true,
      progressUnlockMode: true,
    },
  },
};

contextBridge.exposeInMainWorld('noitaApi', noitaApi);
