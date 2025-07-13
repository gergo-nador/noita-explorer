import { ipcMain } from 'electron';
import path from 'path';
import { electronPaths } from '../electron-paths';
import {
  NoitaDataWakScrapeResult,
  NoitaDataWakScrapeResultStatus,
  NoitaTranslation,
  NoitaWakData,
} from '@noita-explorer/model-noita';
import { noitaPaths, scrapeDataWak } from '@noita-explorer/scrapers';
import { getConfig } from '../persistence/config-store';
import {
  FileSystemDirectoryAccessNode,
  FileSystemFileAccessNode,
  nodeFileSystemHelpers,
} from '@noita-explorer/file-systems';
import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import { Buffer } from 'buffer';
import { FileSystemDirectoryAccessDataWakMemory } from '@noita-explorer/file-systems/data-wak-memory-fs';

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
    (): Promise<NoitaDataWakScrapeResult> => {
      return scrapeDataWakNode();
    },
  );
};

export const scrapeDataWakNode =
  async (): Promise<NoitaDataWakScrapeResult> => {
    const installPath = getConfig('settings.paths.install') as string;
    const commonCsvPath = path.join(
      installPath,
      ...noitaPaths.noitaInstallFolder.translation,
    );

    const translationFile = FileSystemFileAccessNode(commonCsvPath);

    // provide the NollaGamesNoita folder instead of the actual data folder as
    // the code expects the directory above the extracted data wak folder
    let dataWakParentDirectory: FileSystemDirectoryAccess = undefined;

    try {
      const dataWakPath = path.join(
        installPath,
        ...noitaPaths.noitaInstallFolder.dataWak,
      );
      if (nodeFileSystemHelpers.checkPathExist(dataWakPath)) {
        let buffer = await nodeFileSystemHelpers.readFileAsBuffer(dataWakPath);

        buffer = Buffer.from(buffer);
        dataWakParentDirectory = FileSystemDirectoryAccessDataWakMemory(buffer);
      }
    } catch {
      console.error(
        'Could not load data.wak file into memory. Trying extracted data.wak folder for fallback.',
      );
    }

    if (dataWakParentDirectory === undefined) {
      const nollaGamesNoita = getConfig(
        'settings.paths.NollaGamesNoita',
      ) as string;
      const dataFolder = path.join(
        nollaGamesNoita,
        ...noitaPaths.noitaDataWak.folder,
      );
      if (!nodeFileSystemHelpers.checkPathExist(dataFolder)) {
        throw new Error(
          'Could not load data.wak file and extracted data.wak folder does not exist.',
        );
      }

      dataWakParentDirectory = FileSystemDirectoryAccessNode(nollaGamesNoita);
    }

    return scrapeDataWak({ dataWakParentDirectory, translationFile });
  };
