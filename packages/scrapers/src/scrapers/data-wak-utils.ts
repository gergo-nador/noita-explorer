import {
  NoitaDataWakScrapeResult,
  NoitaWakData,
} from '@noita-explorer/model-noita';

export const convertScrapeResultsToDataWak = (
  results: NoitaDataWakScrapeResult,
): NoitaWakData => {
  const translations = results.translations.data ?? {};
  const enemies = results.enemies.data ?? [];
  const perks = results.perks.data ?? [];
  const spells = results.spells.data ?? [];
  const wandConfigs = results.wandConfigs.data ?? [];
  const materials = results.materials.data ?? [];
  const materialReactions = results.materialReactions.data ?? [];

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
