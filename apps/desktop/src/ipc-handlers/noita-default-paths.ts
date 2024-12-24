import { app, ipcMain } from 'electron';
import { Platform } from '../tools/platform';
import path from 'path';

export const registerNoitaDefaultPathsHandlers = () => {
  ipcMain.handle('noita-default-paths:install', () => {
    return Platform.selectValue({
      windows: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Noita',
      linux: '',
      macOs: '',
    });
  });
  ipcMain.handle('noita-default-paths:nolla-games-noita', () => {
    return Platform.selectValue({
      windows: path.join(
        app.getPath('home'),
        'AppData\\LocalLow\\Nolla_Games_Noita',
      ),
      linux: '',
      macOs: '',
    });
  });
};
