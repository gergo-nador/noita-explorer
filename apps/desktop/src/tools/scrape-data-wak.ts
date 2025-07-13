import {
  NoitaDataWakScrapeResult,
  NoitaDataWakScrapeResultStatus,
  NoitaMaterial,
  NoitaMaterialReaction,
  NoitaPerk,
  NoitaScrapedGifWrapper,
  NoitaSpell,
  NoitaTranslation,
  NoitaWandConfig,
} from '@noita-explorer/model-noita';
import path from 'path';
import { noitaPaths, scrape } from '@noita-explorer/scrapers';
import { FileSystemFileAccessNode } from '../file-system/file-system-file-access-node';
import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import { nodeFileSystemHelpers } from './file-system';
import { Buffer } from 'buffer';
import { FileSystemDirectoryAccessDataWakMemory } from '@noita-explorer/file-systems';
import { FileSystemDirectoryAccessNode } from '../file-system/file-system-directory-access-node';
import { NoitaScrapedEnemy } from '@noita-explorer/model-noita/src/scraping/noita-scraped-enemy';

const statusSkipped = {
  status: NoitaDataWakScrapeResultStatus.SKIPPED,
};

export const scrapeDataWak = async ({
  commonCsvPath,
  dataWakPath,
  nollaGamesNoitaPath,
}: {
  commonCsvPath: string;
  dataWakPath: string;
  nollaGamesNoitaPath: string;
}): Promise<NoitaDataWakScrapeResult> => {
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
      enemies: statusSkipped,
      orbGifs: statusSkipped,
      enemyGifs: statusSkipped,
      perks: statusSkipped,
      spells: statusSkipped,
      wandConfigs: statusSkipped,
      materials: statusSkipped,
      materialReactions: statusSkipped,
    };
  }

  // provide the NollaGamesNoita folder instead of the actual data folder as
  // the code expects the directory above the extracted data wak folder
  let dataWakParentDirectory: FileSystemDirectoryAccess = undefined;

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
    const dataFolder = path.join(
      nollaGamesNoitaPath,
      ...noitaPaths.noitaDataWak.folder,
    );
    if (!nodeFileSystemHelpers.checkPathExist(dataFolder)) {
      throw new Error(
        'Could not load data.wak file and extracted data.wak folder does not exist.',
      );
    }

    dataWakParentDirectory = FileSystemDirectoryAccessNode(nollaGamesNoitaPath);
  }

  return scrapeDataWakContent({ dataWakParentDirectory, translations });
};

export const scrapeDataWakContent = async ({
  dataWakParentDirectory,
  translations,
}: {
  dataWakParentDirectory: FileSystemDirectoryAccess;
  translations: StringKeyDictionary<NoitaTranslation>;
}): Promise<NoitaDataWakScrapeResult> => {
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

  let enemies: NoitaScrapedEnemy[] = [];
  let enemiesError: unknown | undefined = undefined;
  try {
    enemies = await scrape.enemies({
      dataWakParentDirectoryApi: dataWakParentDirectory,
      translations: translations,
    });
  } catch (err) {
    enemiesError = err;
  }

  let enemyGifs: StringKeyDictionary<NoitaScrapedGifWrapper> = {};
  let enemyGifErrors: unknown | undefined = undefined;
  const shouldSkipEnemyGifScraping = enemies.length === 0;
  try {
    if (!shouldSkipEnemyGifScraping) {
      enemyGifs = await scrape.enemyAnimations({
        dataWakParentDirectoryApi: dataWakParentDirectory,
        animationInfos: enemies.map((e) => ({ id: e.id })),
      });
    }
  } catch (err) {
    enemyGifErrors = err;
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

  let orbs: StringKeyDictionary<NoitaScrapedGifWrapper> = {};
  let orbsError: unknown | undefined = undefined;
  try {
    orbs = await scrape.orbAnimations({
      dataWakParentDirectoryApi: dataWakParentDirectory,
    });
  } catch (err) {
    orbsError = err;
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
    enemyGifs: {
      status: shouldSkipEnemyGifScraping
        ? NoitaDataWakScrapeResultStatus.SKIPPED
        : enemyGifs === undefined
          ? NoitaDataWakScrapeResultStatus.SUCCESS
          : NoitaDataWakScrapeResultStatus.FAILED,
      data: enemyGifs,
      error: enemyGifErrors,
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
    orbGifs: {
      status:
        orbsError === undefined
          ? NoitaDataWakScrapeResultStatus.SUCCESS
          : NoitaDataWakScrapeResultStatus.FAILED,
      data: orbs,
      error: orbsError,
    },
  };
};
