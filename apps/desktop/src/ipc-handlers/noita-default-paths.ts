import { app, ipcMain } from 'electron';
import path from 'path';
import { platformHelpers } from '@noita-explorer/tools';

export const registerNoitaDefaultPathsHandlers = () => {
  ipcMain.handle('noita-default-paths:install', () => {
    return platformHelpers.selectValue({
      windows: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Noita',
      linux: '',
      macOs: '',
    });
  });
  ipcMain.handle('noita-default-paths:nolla-games-noita', () => {
    return platformHelpers.selectValue({
      windows: path.join(
        app.getPath('home'),
        'AppData\\LocalLow\\Nolla_Games_Noita',
      ),
      linux: '',
      macOs: '',
    });
  });
};
