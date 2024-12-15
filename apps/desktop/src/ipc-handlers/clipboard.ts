import { ipcMain } from 'electron';
import clipboard from 'copy-paste';

export const registerClipboardIpcHandlers = () => {
  ipcMain.handle('clipboard:set', (event, text: string) => {
    clipboard.copy(text);
  });

  ipcMain.handle('clipboard:get', () => {
    return new Promise((resolve, reject) => {
      clipboard.paste((err, text) => {
        if (err) return reject(err);
        resolve(text);
      });
    });
  });
};
