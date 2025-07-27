import {
  NoitaDataWakScrapeResult,
  NoitaDataWakScrapeResultStatus,
  NoitaMaterial,
  NoitaMaterialReaction,
  NoitaPerk,
  NoitaSpell,
  NoitaTranslation,
  NoitaWandConfig,
  NoitaScrapedEnemy,
  NoitaScrapedMedia,
  NoitaScrapedMediaGif,
  NoitaScrapedMediaImage,
} from '@noita-explorer/model-noita';
import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import { scrape } from './scrape';
import {
  AnimationInfo,
  AnimationInfoLayer,
} from './common/scrape-animations/types.ts';
import { imageHelpers } from '@noita-explorer/tools';

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
      enemyMedia: statusSkipped,
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

  let enemyMedia: StringKeyDictionary<NoitaScrapedMedia> = {};
  let enemyGifErrors: unknown | undefined = undefined;
  const shouldSkipEnemyMediaScraping = enemies.length === 0;
  try {
    if (!shouldSkipEnemyMediaScraping) {
      enemyMedia = await scrapeEnemyMedia({
        dataWakParentDirectory,
        enemies,
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

  let orbs: StringKeyDictionary<NoitaScrapedMediaGif> = {};
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
    enemyMedia: {
      status: shouldSkipEnemyMediaScraping
        ? NoitaDataWakScrapeResultStatus.SKIPPED
        : enemyMedia === undefined
          ? NoitaDataWakScrapeResultStatus.SUCCESS
          : NoitaDataWakScrapeResultStatus.FAILED,
      data: enemyMedia,
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

const scrapeEnemyMedia = async ({
  dataWakParentDirectory,
  enemies,
}: {
  dataWakParentDirectory: FileSystemDirectoryAccess;
  enemies: NoitaScrapedEnemy[];
}): Promise<StringKeyDictionary<NoitaScrapedMedia>> => {
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
      return await dataWakParentDirectory.getFile(path);
    } catch {
      return undefined;
    }
  };

  const extraAnimationIds = [
    'player_amulet',
    'player_amulet_gem',
    'player_hat2',
    'player_hat2_shadow',
  ];

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
        useSameSprite: true,
      },
    ],
  };

  const enemyScrapedMedia: StringKeyDictionary<NoitaScrapedMedia> = {};
  const infos: AnimationInfo[] = [];
  for (const enemy of enemies) {
    if (enemy.id === 'player') continue;

    if (!enemy.sprites) {
      console.log('undefined sprites for enemy ' + enemy.id);
      continue;
    }

    const physicsImageShapes = enemy.physicsImageShapes ?? [];
    if (physicsImageShapes.length > 0) {
      const imageFilePath = physicsImageShapes[0].imageFile;
      const imageFile = await dataWakParentDirectory.getFile(imageFilePath);

      const base64 = await imageFile.read.asImageBase64();
      const { width, height } = await imageHelpers.getImageSizeBase64(base64);
      const imageMedia: NoitaScrapedMediaImage = {
        type: 'image',
        imageType: 'physics',
        imageBase64: base64,
        width,
        height,
      };

      enemyScrapedMedia[enemy.id] = imageMedia;
      continue;
    }

    const mainSprite = enemy.sprites[0];
    const remainingSprites = enemy.sprites.slice(1);

    const sprites = remainingSprites
      .filter((s) => !s.additive)
      .filter((s) => !s.tags.includes('gun'));
    const additiveSprites = remainingSprites.filter(
      (s) => s.additive || mainSprite.additive,
    );

    if (sprites.length > 1) {
      console.log(`enemy ${enemy.id} has ${sprites.length} sprites`);
      continue;
    }

    if (mainSprite === undefined) {
      console.log('Main sprite undefined for id: ' + enemy.id);
      continue;
    }

    if (!mainSprite.imageFile.endsWith('.xml')) {
      console.log('main sprite does not end with xml: ' + mainSprite.imageFile);
      continue;
    }

    let layers: AnimationInfoLayer[] = [];

    {
      // guns
      const guns = remainingSprites
        .filter((s) => s.tags.includes('gun'))
        .map(
          async (gun): Promise<AnimationInfoLayer> => ({
            id: gun.imageFile,
            file: await dataWakParentDirectory.getFile(gun.imageFile),
            overlayOptions: {
              blendMode: 'source_over',
            },
          }),
        );
      layers = layers.concat(await Promise.all(guns));
    }
    {
      const additive = additiveSprites
        // sort by z-index
        .sort((a, b) => {
          const zIndexA = a.zIndex;
          const zIndexB = b.zIndex;

          if (zIndexA === undefined && zIndexB === undefined) {
            return 0;
          }

          return (zIndexA ?? 0) - (zIndexB ?? 0);
        })
        .map(
          async (s): Promise<AnimationInfoLayer> => ({
            id: s.imageFile,
            file: await dataWakParentDirectory.getFile(s.imageFile),
            overlayOptions: {
              blendMode: 'source_over',
            },
          }),
        );

      layers = layers.concat(await Promise.all(additive));
    }

    try {
      const animationInfo: AnimationInfo = {
        id: enemy.id,
        file: await dataWakParentDirectory.getFile(mainSprite.imageFile),
        layers: layers.length > 0 ? layers : undefined,
      };
      infos.push(animationInfo);
    } catch (err) {
      console.error(err);
    }
  }

  const extraAnimationInfos = await Promise.all(
    extraAnimationIds.map((id) =>
      getEnemySpriteFile(id).then((file) => ({
        id: id,
        file: file as FileSystemFileAccess,
      })),
    ),
  );

  const allAnimationInfos: AnimationInfo[] = [
    ...infos,
    enemySprite,
    ...extraAnimationInfos,
  ];

  const animations = await scrape.enemyAnimations({
    dataWakParentDirectoryApi: dataWakParentDirectory,
    animationInfos: allAnimationInfos,
  });

  return { ...enemyScrapedMedia, ...animations };
};
