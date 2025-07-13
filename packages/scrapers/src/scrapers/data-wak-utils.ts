import {
  NoitaDataWakScrapeResult,
  NoitaEnemy,
  NoitaEnemyGif,
  NoitaEnemyVariant,
  NoitaScrapedGifWrapper,
  NoitaWakData,
} from '@noita-explorer/model-noita';

/**
 * Important Note: This function will only save metadata of the gifs in the enemies,
 *                 the buffer will be discarded. It is the consumer's responsibility to save the gifs.
 * @param results
 */
export const convertScrapeResultsToDataWak = (
  results: NoitaDataWakScrapeResult,
): NoitaWakData => {
  const translations = results.translations.data ?? {};
  const scrapedEnemies = results.enemies.data ?? [];
  const enemyGifs = results.enemyGifs.data ?? {};
  const perks = results.perks.data ?? [];
  const spells = results.spells.data ?? [];
  const wandConfigs = results.wandConfigs.data ?? [];
  const materials = results.materials.data ?? [];
  const materialReactions = results.materialReactions.data ?? [];

  // handle gifs
  const enemies: NoitaEnemy[] = scrapedEnemies.map((e): NoitaEnemy => {
    const variants: NoitaEnemyVariant[] = e.variants.map((v) => ({
      ...v,
      enemy: { ...v.enemy, gifs: undefined },
    }));

    const scrapedGif: NoitaScrapedGifWrapper | undefined = enemyGifs[e.id];
    const processedGifs = scrapedGif?.gifs?.map((g) => {
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

    return {
      ...e,
      gifs: processedGifs ? Object.fromEntries(processedGifs) : undefined,
      variants: variants,
    };
  });

  const now = new Date();

  return {
    scrapedAt: now.toISOString(),
    scrapedAtUnix: now.getTime(),
    version: 1,

    translations: translations,
    enemies: enemies,
    perks: perks,
    spells: spells,
    wandConfigs: wandConfigs,
    materials: materials,
    materialReactions: materialReactions,
  };
};
