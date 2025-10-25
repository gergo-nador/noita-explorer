import { readTranslations } from './translations/read-translations.ts';
import { scrapeWorldState } from './save00/world-state/scrape-world-state.ts';
import { scrapeProgressFlags } from './save00/persistent/progress-flags/scrape-progress-flags.ts';
import { scrapeEnemyStatistics } from './save00/stats/enemy-statistics/scrape-enemy-statistics.ts';
import { scrapeSessions } from './save00/stats/sessions/scrape-sessions.ts';
import { scrapeBonesWands } from './save00/persistent/bones-wands/scrape-bones-wands.ts';
import { scrapePerks } from './datawak/perks/scrape-perks.ts';
import { scrapeEnemies } from './datawak/enemies/scrape-enemies.ts';
import { scrapeSpells } from './datawak/spells/scrape-spells.ts';
import { scrapeMaterials } from './datawak/materials/scrape-materials.ts';
import { scrapeWandConfigs } from './datawak/wands/scrape-wand-configs.ts';
import { scrapePlayerState } from './save00/player-state/scrape-player-state.ts';
import { scrapeUnlockedOrbs } from './save00/persistent/orbs/scrape-orbs.ts';
import { scrapeEnemyAnimation } from './datawak/enemies/scrape-enemy-animation.ts';
import { scrapeOrbAnimations } from './datawak/orbs/scrape-orb-animations.ts';
import { scrapeAnimationInfoFrames } from './common/scrape-animations/scrape-animations.ts';
import { convertScrapeResultsToDataWak } from './convert-scrape-results-to-data-wak.ts';
import { scrapeDataWak } from './scrape-data-wak.ts';
import { scrapeStreamInfo } from './save00/world/stream-info/scrape-stream-info.ts';
import { scrapeEntitySchema } from './common/entity-schema/scrape-entity-schema.ts';
import { scrapeWorldPixelScenes } from './save00/world/world-pixel-scenes/scrape-world-pixel-scenes.ts';

export const scrape = {
  dataWak: {
    materials: scrapeMaterials,
    enemies: scrapeEnemies,
    perks: scrapePerks,
    spells: scrapeSpells,
    wandConfigs: scrapeWandConfigs,
    enemyAnimations: scrapeEnemyAnimation,
    scrapeAnimationFrames: scrapeAnimationInfoFrames,
    orbAnimations: scrapeOrbAnimations,
  },
  save00: {
    bonesWands: scrapeBonesWands,
    enemyStatistics: scrapeEnemyStatistics,
    orbsUnlocked: scrapeUnlockedOrbs,
    playerState: scrapePlayerState,

    progressFlags: scrapeProgressFlags,
    sessions: scrapeSessions,
    worldState: scrapeWorldState,
    streamInfo: scrapeStreamInfo,
    worldPixelScenes: scrapeWorldPixelScenes,
  },
  entitySchema: scrapeEntitySchema,
  translations: readTranslations,
};

export const scrapeUtils = {
  scrapeDataWak,
  convertScrapeResultsToDataWak,
};
