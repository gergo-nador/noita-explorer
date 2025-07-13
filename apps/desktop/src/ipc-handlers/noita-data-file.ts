import { ipcMain } from 'electron';
import path from 'path';
import { electronPaths } from '../electron-paths';
import {
  NoitaDataWakScrapeResult,
  NoitaWakData,
} from '@noita-explorer/model-noita';
import { noitaPaths } from '@noita-explorer/scrapers';
import { getConfig } from '../persistence/config-store';
import { scrapeDataWak } from '../tools/scrape-data-wak';
import { nodeFileSystemHelpers } from '@noita-explorer/file-systems/node';

const noitaWakDataPath = path.join(
  electronPaths.appData,
  'noita_wak_data.json',
);

export const registerNoitaDataFileHandlers = () => {
  ipcMain.handle('noita-data-file:is-ready', () => {
    return nodeFileSystemHelpers.checkPathExist(noitaWakDataPath);
  });
  ipcMain.handle('noita-data-file:get', async () => {
    if (!nodeFileSystemHelpers.checkPathExist(noitaWakDataPath)) {
      throw new Error('noita_wak_data.json does not exist');
    }

    const text = await nodeFileSystemHelpers.readFileAsText(noitaWakDataPath);
    const data: NoitaWakData = JSON.parse(text);

    return data;
  });
  ipcMain.handle(
    'noita-data-file:write',
    async (event, dataWak: NoitaWakData) => {
      const json = JSON.stringify(dataWak);
      await nodeFileSystemHelpers.writeTextFile(noitaWakDataPath, json);
    },
  );
  ipcMain.handle(
    'noita-data-file:scrape',
    async (): Promise<NoitaDataWakScrapeResult> => {
      const installPath = getConfig('settings.paths.install') as string;
      const commonCsvPath = path.join(
        installPath,
        ...noitaPaths.noitaInstallFolder.translation,
      );

      const dataWakPath = path.join(
        installPath,
        ...noitaPaths.noitaInstallFolder.dataWak,
      );

      const nollaGamesNoita = getConfig(
        'settings.paths.NollaGamesNoita',
      ) as string;

      return await scrapeDataWak({
        commonCsvPath: commonCsvPath,
        dataWakPath: dataWakPath,
        nollaGamesNoitaPath: nollaGamesNoita,
      });
    },
  );
};
