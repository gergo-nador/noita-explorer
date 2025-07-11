import { readTranslations } from './translations/read-translations.ts';
import { scrapeWorldState } from './save00/scrape-world-state.ts';
import { scrapeProgressFlags } from './save00/persistent/scrape-progress-flags.ts';
import { scrapeEnemyStatistics } from './save00/stats/scrape-enemy-statistics.ts';
import { scrapeSessions } from './save00/stats/scrape-sessions.ts';
import { scrapeBonesWands } from './save00/persistent/scrape-bones-wands.ts';
import { scrapePerks } from './datawak/scrape-perks.ts';
import { scrapeEnemies } from './datawak/scrape-enemies/scrape-enemies.ts';
import { scrapeSpells } from './datawak/scrape-spells.ts';
import { scrapeMaterials } from './datawak/scrape-materials.ts';
import { scrapeWandConfigs } from './datawak/scrape-wand-configs.ts';
import { scrapePlayerState } from './save00/scrape-player-state.ts';
import { scrapeUnlockedOrbs } from './save00/scrape-orbs.ts';
import { convertScrapeResultsToDataWak } from './data-wak-utils.ts';
import { scrapeAnimations } from './datawak/scrape-animations/scrape-animations.ts';

export const scrape = {
  bonesWands: scrapeBonesWands,
  enemies: scrapeEnemies,
  enemyStatistics: scrapeEnemyStatistics,
  materials: scrapeMaterials,
  orbsUnlocked: scrapeUnlockedOrbs,
  perks: scrapePerks,
  playerState: scrapePlayerState,
  progressFlags: scrapeProgressFlags,
  sessions: scrapeSessions,
  spells: scrapeSpells,
  translations: readTranslations,
  wandConfigs: scrapeWandConfigs,
  worldState: scrapeWorldState,
  enemyAnimations: scrapeAnimations,
};

export const scrapeUtils = {
  convertScrapeResultsToDataWak,
};
