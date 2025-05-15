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
      return await scrapeDataWak();
    },
  );
};

const scrapeDataWak = async (): Promise<NoitaDataWakScrapeResult> => {
  const installPath = getConfig('settings.paths.install') as string;
  const commonCsvPath = path.join(
    installPath,
    ...noitaPaths.noitaInstallFolder.translation,
  );

  const translationFile = FileSystemFileAccessNode(commonCsvPath);

  let translations: StringKeyDictionary<NoitaTranslation>;

  try {
    translations = await scrape.translations({
      translationFile: translationFile,
    });
  } catch (e) {
    return {
      translations: {
        status: NoitaDataWakScrapeResultStatus.FAILED,
        error: {
          message: JSON.stringify(e),
          errorData: e,
        },
      },
      enemies: {
        status: NoitaDataWakScrapeResultStatus.SKIPPED,
      },
      perks: {
        status: NoitaDataWakScrapeResultStatus.SKIPPED,
      },
      spells: {
        status: NoitaDataWakScrapeResultStatus.SKIPPED,
      },
      wandConfigs: {
        status: NoitaDataWakScrapeResultStatus.SKIPPED,
      },
      materials: {
        status: NoitaDataWakScrapeResultStatus.SKIPPED,
      },
      materialReactions: {
        status: NoitaDataWakScrapeResultStatus.SKIPPED,
      },
    };
  }

  // provide the NollaGamesNoita folder instead of the actual data folder as
  // the code expects the directory above the extracted data wak folder
  let dataWakParentDirectory: FileSystemDirectoryAccess = undefined;

  const dataWakPath = path.join(
    installPath,
    ...noitaPaths.noitaInstallFolder.dataWak,
  );

  try {
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

  let perks: NoitaPerk[] = [];
  let perkError: unknown | undefined = undefined;
  try {
    perks = await scrape.perks({
      dataWakParentDirectoryApi: dataWakParentDirectory,
      translations: translations,
    });
  } catch (e) {
    perkError = e;
  }

  let spells: NoitaSpell[] = [];
  let spellsError: unknown | undefined = undefined;
  try {
    spells = await scrape.spells({
      dataWakParentDirectoryApi: dataWakParentDirectory,
      translations: translations,
    });
  } catch (e) {
    spellsError = e;
  }

  let enemies: NoitaEnemy[] = [];
  let enemiesError: unknown | undefined = undefined;
  try {
    enemies = await scrape.enemies({
      dataWakParentDirectoryApi: dataWakParentDirectory,
      translations: translations,
    });
  } catch (err) {
    enemiesError = err;
  }

  let wandConfigs: NoitaWandConfig[] = [];
  let wandConfigError: unknown | undefined = undefined;
  try {
    wandConfigs = await scrape.wandConfigs({
      dataWakParentDirectoryApi: dataWakParentDirectory,
    });
  } catch (err) {
    wandConfigError = err;
  }

  let materials: NoitaMaterial[] = [];
  let materialReactions: NoitaMaterialReaction[] = [];
  let materialError: unknown | undefined = undefined;
  try {
    const scrapedMaterials = await scrape.materials({
      translations: translations,
      dataWakParentDirectoryApi: dataWakParentDirectory,
    });
    materials = scrapedMaterials.materials;
    materialReactions = scrapedMaterials.reactions;
  } catch (err) {
    materialError = err;
  }

  return {
    translations: {
      status: NoitaDataWakScrapeResultStatus.SUCCESS,
      data: translations,
      error: undefined,
    },
    perks: {
      status:
        perkError === undefined
          ? NoitaDataWakScrapeResultStatus.SUCCESS
          : NoitaDataWakScrapeResultStatus.FAILED,
      data: perks,
      error: perkError,
    },
    spells: {
      status:
        spellsError === undefined
          ? NoitaDataWakScrapeResultStatus.SUCCESS
          : NoitaDataWakScrapeResultStatus.FAILED,
      data: spells,
      error: spellsError,
    },
    enemies: {
      status:
        enemiesError === undefined
          ? NoitaDataWakScrapeResultStatus.SUCCESS
          : NoitaDataWakScrapeResultStatus.FAILED,
      data: enemies,
      error: enemiesError,
    },
    wandConfigs: {
      status:
        wandConfigError === undefined
          ? NoitaDataWakScrapeResultStatus.SUCCESS
          : NoitaDataWakScrapeResultStatus.FAILED,
      data: wandConfigs,
      error: wandConfigError,
    },
    materials: {
      status:
        materialError === undefined
          ? NoitaDataWakScrapeResultStatus.SUCCESS
          : NoitaDataWakScrapeResultStatus.FAILED,
      data: materials,
      error: materialError,
    },
    materialReactions: {
      status:
        materialError === undefined
          ? NoitaDataWakScrapeResultStatus.SUCCESS
          : NoitaDataWakScrapeResultStatus.FAILED,
      data: materialReactions,
      error: materialError,
    },
  };
};
