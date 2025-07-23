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
  NoitaScrapedEnemy,
} from '@noita-explorer/model-noita';
import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import { scrape } from './scrape';
import { AnimationInfo } from './common/scrape-animations/types.ts';

const statusSkipped = {
  status: NoitaDataWakScrapeResultStatus.SKIPPED,
};

export const scrapeDataWak = async ({
  translationFile,
  dataWakParentDirectory,
}: {
  translationFile: FileSystemFileAccess;
  dataWakParentDirectory: FileSystemDirectoryAccess;
}): Promise<NoitaDataWakScrapeResult> => {
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
      const extraAnimationIds = [
        'player_amulet',
        'player_amulet_gem',
        'player_hat2',
        'player_hat2_shadow',
      ];
      const getEnemySpriteFile = async (
        id: string,
        type: 'xml' | 'png' = 'xml',
      ) => {
        const path = await dataWakParentDirectory.path.join([
          'data',
          'enemies_gfx',
          id + '.' + type,
        ]);
        try {
          return dataWakParentDirectory.getFile(path);
        } catch {
          return undefined;
        }
      };

      const enemySprite: AnimationInfo = {
        id: 'player',
        file: (await getEnemySpriteFile('player')) as FileSystemFileAccess,
        layers: [
          {
            id: 'player_uv_src',
            file: (await getEnemySpriteFile(
              'player_uv_src',
              'png',
            )) as FileSystemFileAccess,
            imageManipulation: {
              reColor: {
                _: '#00000000',
                // hand end
                '#FF00FF': '#DBC067',
                // hand
                '#FF00FF40': '#7f5476',
              },
            },
          },
        ],
      };

      const ids = [...enemies.map((e) => e.id), ...extraAnimationIds]
        .filter((e) => e !== 'player')
        .map(async (e) => {
          return {
            id: e,
            file: (await getEnemySpriteFile(e)) as FileSystemFileAccess,
          };
        })
        .filter(async (e) => {
          const animation = await e;
          return animation.file !== undefined;
        });

      const animationInfos: AnimationInfo[] = [
        ...(await Promise.all(ids)),
        enemySprite,
      ];

      enemyGifs = await scrape.enemyAnimations({
        dataWakParentDirectoryApi: dataWakParentDirectory,
        animationInfos: animationInfos,
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
