import {
  NoitaDataWakScrapeResult,
  NoitaDataWakScrapeResultStatus,
  NoitaEnemy,
  NoitaEnemyGif,
  NoitaEnemyImageMedia,
  NoitaEnemyMedia,
  NoitaEnemyVariant,
  NoitaMaterial,
  NoitaPerk,
  NoitaScrapedMedia,
  NoitaSpell,
  NoitaWakData,
  NoitaWandConfig,
} from '@noita-explorer/model-noita';

/**
 * Important Note: only gif metadata of the enemies will be saved, the buffer will be discarded.
 *                 It is the caller's responsibility to save the actual gifs.
 * Important Note: orb gifs are discarded
 * @param results
 */
export const convertScrapeResultsToDataWak = (
  results: NoitaDataWakScrapeResult,
): NoitaWakData => {
  const translations = results.translations.data ?? {};
  const scrapedEnemies = results.enemies.data ?? [];
  const scrapedEnemyMedia = results.enemyMedia.data ?? {};
  const scrapedWandConfigs = results.wandConfigs.data ?? [];
  const scrapedMaterials = results.materials.data ?? [];
  const materialReactions = results.materialReactions.data ?? [];

  // handle perks
  const perksWithoutImage = results.perks.data?.map((perk) => ({
    ...perk,
    imageBase64: undefined,
  }));
  const perks: NoitaPerk[] = perksWithoutImage ?? [];

  // handle spells
  const spellsWithoutImage = results.spells.data?.map((spell) => ({
    ...spell,
    imageBase64: undefined,
  }));
  const spells: NoitaSpell[] = spellsWithoutImage ?? [];

  // handle enemies
  const enemies: NoitaEnemy[] = scrapedEnemies.map((e): NoitaEnemy => {
    const variants: NoitaEnemyVariant[] = e.variants.map((v) => ({
      ...v,
      enemy: {
        ...v.enemy,
        imageBase64: undefined,
        media: undefined,
        physicsImageShapes: undefined,
        sprites: undefined,
      },
    }));

    const scrapedMedia: NoitaScrapedMedia | undefined = scrapedEnemyMedia[e.id];
    const enemyMedia: NoitaEnemyMedia | undefined = getEnemyMedia({
      media: scrapedMedia,
    });

    const enemy = {
      ...e,
      imageBase64: undefined,
      media: enemyMedia,
      variants: variants,
      sprites: undefined,
      physicsImageShapes: undefined,
    };

    return enemy;
  });

  // handle materials
  const materials: NoitaMaterial[] = scrapedMaterials.map(
    (m): NoitaMaterial => {
      const material = {
        ...m,
        hasGraphicsImage: Boolean(m.imageBase64),
        imageBase64: undefined,
      };

      return material;
    },
  );

  // wands
  const wands: NoitaWandConfig[] = scrapedWandConfigs.map(
    (w): NoitaWandConfig => {
      const wand = {
        ...w,
        imageBase64: undefined,
      };

      return wand;
    },
  );

  // biomes
  const biomes = results.biomes.data;
  if (biomes === undefined) {
    throw new Error('Biomes are undefined');
  }

  // image index
  const mediaIndex = results.mediaIndex.data;
  if (
    results.mediaIndex.status !== NoitaDataWakScrapeResultStatus.SUCCESS ||
    !mediaIndex
  ) {
    throw new Error('Failed to parse media dimensions');
  }

  // finalize data wak
  const now = new Date();

  return {
    scrapedAt: now.toISOString(),
    scrapedAtUnix: now.getTime(),
    version: 1,

    translations: translations,
    enemies: enemies,
    perks: perks,
    spells: spells,
    wandConfigs: wands,
    materials: materials,
    materialReactions: materialReactions,
    biomes: biomes,
    mediaIndex: mediaIndex,
  };
};

const getEnemyMedia = ({
  media,
}: {
  media: NoitaScrapedMedia | undefined;
}): NoitaEnemyMedia | undefined => {
  if (!media) return;

  if (media.type === 'gif') {
    const processedGifs = media?.gifs?.map((g) => {
      const noitaEnemyGif: NoitaEnemyGif = {
        name: g.sprite.name,
        frameCount: g.sprite.frameCount,
        frameHeight: g.sprite.frameActualHeight,
        frameWidth: g.sprite.frameActualWidth,
        frameWait: g.sprite.frameWait,
        loop: g.repeat,
      };
      return [g.sprite.name, noitaEnemyGif] as [string, NoitaEnemyGif];
    });

    if (processedGifs && processedGifs.length > 0) {
      const gifs = Object.fromEntries(processedGifs);
      return { type: 'gif', gifs: gifs };
    }
  } else if (media.type === 'image') {
    return {
      type: 'image',
      imageType: media.name as NoitaEnemyImageMedia['imageType'],
      width: media.width,
      height: media.height,
    };
  }
};
