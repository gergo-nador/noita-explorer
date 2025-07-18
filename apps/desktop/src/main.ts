import {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
} from 'electron';
import path from 'path';
import started from 'electron-squirrel-startup';
import { registerClipboardIpcHandlers } from './ipc-handlers/clipboard';
import { registerConfigIpcHandlers } from './ipc-handlers/config';
import { registerNoitaDataFileHandlers } from './ipc-handlers/noita-data-file';
import { registerNoitaDefaultPathsHandlers } from './ipc-handlers/noita-default-paths';
import { registerDialogHandlers } from './ipc-handlers/dialog';
import { registerSave00Handlers } from './ipc-handlers/save00';
import { registerLaunchHandlers } from './ipc-handlers/launch';
import { platformHelpers } from '@noita-explorer/tools';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const ipcHandlerRegisters = [
  registerClipboardIpcHandlers,
  registerConfigIpcHandlers,
  registerNoitaDataFileHandlers,
  registerNoitaDefaultPathsHandlers,
  registerDialogHandlers,
  registerSave00Handlers,
  registerLaunchHandlers,
];

const template: (MenuItemConstructorOptions | MenuItem)[] = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open Dev Tools',
        click: (menuItem: MenuItem, browserWindow: BrowserWindow) => {
          browserWindow.webContents.openDevTools();
        },
      },
      {
        label: 'Reload',
        click: (menuItem: MenuItem, browserWindow: BrowserWindow) => {
          browserWindow.webContents.reload();
        },
      },
      {
        label: 'Go to Main Page',
        click: (menuItem: MenuItem, browserWindow: BrowserWindow) => {
          browserWindow.webContents.loadURL('https://localhost:4000');
        },
      },
      platformHelpers.isMacOs ? { role: 'close' } : { role: 'quit' },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1300,
    height: 900,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  /*if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }*/
  mainWindow.loadURL('https://localhost:4000');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  ipcHandlerRegisters.forEach((handler) => handler());
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (!platformHelpers.isMacOs) {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
