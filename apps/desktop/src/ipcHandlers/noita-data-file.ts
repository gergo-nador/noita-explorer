import { ipcMain } from 'electron';
import {
  checkPathExist,
  readFileAsText,
  writeTextFile,
} from '../utils/file-system';
import path from 'path';
import { electronPaths } from '../electron-paths';
import { NoitaWakData } from '@noita-explorer/model';

const noitaWakDataPath = path.join(
  electronPaths.appData,
  'noita_wak_data.json',
);

export const registerNoitaDataFileHandlers = () => {
  ipcMain.handle('noita-data-file:is-ready', () => {
    return checkPathExist(noitaWakDataPath);
  });
  ipcMain.handle('noita-data-file:get', async () => {
    if (!checkPathExist(noitaWakDataPath)) {
      throw new Error('noita_wak_data.json does not exist');
    }

    const text = await readFileAsText(noitaWakDataPath);
    const data: NoitaWakData = JSON.parse(text);

    return data;
  });
  ipcMain.handle(
    'noita-data-file:write',
    async (event, dataWak: NoitaWakData) => {
      const json = JSON.stringify(dataWak);
      await writeTextFile(noitaWakDataPath, json);
    },
  );
};
