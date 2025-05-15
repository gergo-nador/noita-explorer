import { readTranslations } from './translations/read-translations.ts';
import { scrapeWorldState } from './save00/scrape-world-state.ts';
import { scrapeProgressFlags } from './save00/persistent/scrape-progress-flags.ts';
import { scrapeEnemyStatistics } from './save00/stats/scrape-enemy-statistics.ts';
import { scrapeSessions } from './save00/stats/scrape-sessions.ts';
import { scrapeBonesWands } from './save00/persistent/scrape-bones-wands.ts';
import { scrapePerks } from './datawak/scrape-perks.ts';
import { scrapeEnemies } from './datawak/scrape-enemies.ts';
import { scrapeSpells } from './datawak/scrape-spells.ts';
import { scrapeMaterials } from './datawak/scrape-materials.ts';
import { scrapeWandConfigs } from './datawak/scrape-wand-configs.ts';

export const scrape = {
  translations: readTranslations,
  worldState: scrapeWorldState,
  progressFlags: scrapeProgressFlags,
  enemyStatistics: scrapeEnemyStatistics,
  sessions: scrapeSessions,
  bonesWands: scrapeBonesWands,
  perks: scrapePerks,
  enemies: scrapeEnemies,
  spells: scrapeSpells,
  materials: scrapeMaterials,
  wandConfigs: scrapeWandConfigs,
};
