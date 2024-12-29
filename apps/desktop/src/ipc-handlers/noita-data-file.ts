import { ipcMain } from 'electron';
import path from 'path';
import { electronPaths } from '../electron-paths';
import {
  NoitaDataWakScrapeResult,
  NoitaDataWakScrapeResultStatus,
  NoitaEnemy,
  noitaPaths,
  NoitaPerk,
  NoitaSpell,
  NoitaTranslation,
  NoitaWakData,
  NoitaWandConfig,
  StringKeyDictionary,
} from '@noita-explorer/model';
import {
  readTranslations,
  scrapeEnemy,
  scrapePerks,
  scrapeSpells,
  scrapeWandConfigs,
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
  ipcMain.handle(
    'noita-data-file:scrape',
    async (): Promise<NoitaDataWakScrapeResult> => {
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
        };
      }

      // provide the NollaGamesNoita folder instead of the actual data folder as
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

      const dataWakDirectoryApi =
        FileSystemDirectoryAccessNode(nollaGamesNoita);

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

      let wandConfigs: NoitaWandConfig[] = [];
      let wandConfigError: unknown | undefined = undefined;
      try {
        wandConfigs = await scrapeWandConfigs({
          dataWakDirectoryApi: dataWakDirectoryApi,
        });
      } catch (err) {
        wandConfigError = err;
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
      };
    },
  );
};
