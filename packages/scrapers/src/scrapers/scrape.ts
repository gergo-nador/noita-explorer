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
import { scrapeEnemyAnimation } from './datawak/scrape-enemies/scrape-enemy-animation.ts';
import { scrapeOrbAnimations } from './datawak/scrape-orb-animations.ts';
import { scrapeAnimationInfoFrames } from './common/scrape-animations/scrape-animations.ts';

export type { AnimationInfo } from './common/scrape-animations/types.ts';

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
  enemyAnimations: scrapeEnemyAnimation,
  scrapeAnimationFrames: scrapeAnimationInfoFrames,
  orbAnimations: scrapeOrbAnimations,
};

export const scrapeUtils = {
  convertScrapeResultsToDataWak,
};
