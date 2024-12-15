// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { NoitaAPI } from '@noita-explorer/model';
import { Platform } from './utils/Platform';

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
    },
    defaultPaths: {
      installPathDefault: () =>
        ipcRenderer.invoke('noita-default-paths:install'),
      nollaGamesNoitaDefault: () =>
        ipcRenderer.invoke('noita-default-paths:nolla-games-noita'),
    },
    fileAccessApis: {
      translationsFile: () =>
        ipcRenderer.invoke('noita-file-access:translations'),
      dataWakExtracted: () =>
        ipcRenderer.invoke('noita-file-access:data-wak-extracted'),
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
    web: false,
    desktop: {
      isMacOs: Platform.isMacOs,
      isLinux: Platform.isLinux,
      isWindows: Platform.isWindows,
    },
  },
};

contextBridge.exposeInMainWorld('noitaApi', noitaApi);
