import { BrowserWindow, dialog, ipcMain } from 'electron';
import { openExplorer } from '../utils/file-system';

export const registerDialogHandlers = () => {
  ipcMain.handle('dialog:openDirectory', async (event, args) => {
    const window = BrowserWindow.fromId(event.frameId);
    const { canceled, filePaths } = await dialog.showOpenDialog(window, {
      properties: ['openDirectory'],
      defaultPath: args?.startIn,
      title: args?.title,
    });
    if (canceled) {
      return undefined;
    } else {
      return filePaths[0];
    }
  });

  ipcMain.handle('dialog:openFile', async (event, args) => {
    const window = BrowserWindow.fromId(event.frameId);
    const { canceled, filePaths } = await dialog.showOpenDialog(window, {
      properties: ['openFile'],
      defaultPath: args?.startIn,
      title: args?.title,
    });
    if (canceled) {
      return undefined;
    } else {
      return filePaths[0];
    }
  });

  ipcMain.handle('dialog:openExplorer', async (event, path: string) => {
    openExplorer(path);
    return true;
  });
};
