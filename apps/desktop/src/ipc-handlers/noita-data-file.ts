import { ipcMain } from 'electron';
import path from 'path';
import { electronPaths } from '../electron-paths';
import {
  ImportResultStatus,
  NoitaEnemy,
  noitaPaths,
  NoitaPerk,
  NoitaSpell,
  NoitaTranslation,
  NoitaWakData,
  StringKeyDictionary,
} from '@noita-explorer/model';
import {
  readTranslations,
  scrapeEnemy,
  scrapePerks,
  scrapeSpells,
} from '@noita-explorer/scrapers';
import { getConfig } from '../persistence/config-store';
import { nodeFileSystemHelpers } from '../tools/file-system';
import { FileSystemFileAccessNode } from '../file-system/FileSystemFileAccessNode';
import { FileSystemDirectoryAccessNode } from '../file-system/FileSystemDirectoryAccessNode';

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
  ipcMain.handle('noita-data-file:scrape', async () => {
    const installPath = getConfig('settings.paths.install') as string;
    const commonCsvPath = path.join(
      installPath,
      ...noitaPaths.noitaInstallFolder.translation,
    );

    const translationFile = FileSystemFileAccessNode(commonCsvPath);

    let translations: StringKeyDictionary<NoitaTranslation>;

    try {
      translations = await readTranslations({
        translationFile: translationFile,
      });
    } catch (e) {
      return {
        translations: {
          status: ImportResultStatus.FAILED,
          error: {
            message: JSON.stringify(e),
            errorData: e,
          },
        },
        enemies: {
          status: ImportResultStatus.SKIPPED,
        },
        perks: {
          status: ImportResultStatus.SKIPPED,
        },
        spells: {
          status: ImportResultStatus.SKIPPED,
        },
      };
    }

    // provide thee NollaGamesNoita folder instead of the actual data folder as
    // the code expects the directory above the extracted data wak folder
    const nollaGamesNoita = getConfig(
      'settings.paths.NollaGamesNoita',
    ) as string;

    const dataFolder = path.join(
      nollaGamesNoita,
      ...noitaPaths.noitaDataWak.folder,
    );
    if (!nodeFileSystemHelpers.checkPathExist(dataFolder)) {
      throw new Error('Extracted data path does not exist');
    }

    const dataWakDirectoryApi = FileSystemDirectoryAccessNode(nollaGamesNoita);

    let perks: NoitaPerk[] = [];
    let perkError: unknown | undefined = undefined;
    try {
      perks = await scrapePerks({
        dataWakDirectoryApi: dataWakDirectoryApi,
        translations: translations,
      });
    } catch (e) {
      perkError = e;
    }

    let spells: NoitaSpell[] = [];
    let spellsError: unknown | undefined = undefined;
    try {
      spells = await scrapeSpells({
        dataWakDirectoryApi: dataWakDirectoryApi,
        translations: translations,
      });
    } catch (e) {
      spellsError = e;
    }

    let enemies: NoitaEnemy[] = [];
    let enemiesError: unknown | undefined = undefined;
    try {
      enemies = await scrapeEnemy({
        dataWakDirectoryApi: dataWakDirectoryApi,
        translations: translations,
      });
    } catch (err) {
      enemiesError = err;
    }

    return {
      translations: {
        status: ImportResultStatus.SUCCESS,
        data: translations,
        error: undefined,
      },
      perks: {
        status:
          perkError === undefined
            ? ImportResultStatus.SUCCESS
            : ImportResultStatus.FAILED,
        data: perks,
        error: perkError,
      },
      spells: {
        status:
          spellsError === undefined
            ? ImportResultStatus.SUCCESS
            : ImportResultStatus.FAILED,
        data: spells,
        error: spellsError,
      },
      enemies: {
        status:
          enemiesError === undefined
            ? ImportResultStatus.SUCCESS
            : ImportResultStatus.FAILED,
        data: enemies,
        error: enemiesError,
      },
    };
  });
};
