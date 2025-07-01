import { ipcMain } from 'electron';
import path from 'path';
import { electronPaths } from '../electron-paths';
import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import {
  NoitaDataWakScrapeResult,
  NoitaDataWakScrapeResultStatus,
  NoitaEnemy,
  NoitaMaterial,
  NoitaMaterialReaction,
  NoitaPerk,
  NoitaSpell,
  NoitaTranslation,
  NoitaWakData,
  NoitaWandConfig,
} from '@noita-explorer/model-noita';
import { noitaPaths, scrape } from '@noita-explorer/scrapers';
import { getConfig } from '../persistence/config-store';
import { nodeFileSystemHelpers } from '../tools/file-system';
import { FileSystemFileAccessNode } from '../file-system/file-system-file-access-node';
import { FileSystemDirectoryAccessNode } from '../file-system/file-system-directory-access-node';
import { FileSystemDirectoryAccessDataWakMemory } from '@noita-explorer/file-systems';
import { Buffer } from 'buffer';
import { scrapeDataWak } from '../tools/scrape-data-wak';

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
