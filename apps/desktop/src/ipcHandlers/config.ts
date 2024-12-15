import { ipcMain } from 'electron';
import { getConfig, setConfig } from '../persistence/ConfigStore';

export const registerConfigIpcHandlers = () => {
  ipcMain.handle('config:get', (event, key: string) => {
    return getConfig(key);
  });
  ipcMain.handle(
    'config:set',
    (event, args: { key: string; value: string }) => {
      setConfig(args.key, args.value);
    },
  );
};
