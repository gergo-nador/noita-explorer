import {
  fetchWikiEnemies,
  fetchWikiMaterials,
  fetchWikiPerks,
  fetchWikiSpells,
} from './fetchers';
import { readDataWak, writeDataWak } from '../utils/set-data-wak';
import { stringHelpers } from '@noita-explorer/tools';

if (process.env.CI_INTERNET_DISABLED === '1') {
  console.log(
    'Skipping wiki links scraping as internet access is disabled disabled CI_INTERNET_DISABLED=1',
  );
  process.exit(0);
}

run();

async function run() {
  const dataWak = readDataWak();

  // perks
  {
    const perkWikis = await fetchWikiPerks();
    for (const perk of dataWak.perks) {
      const name = stringHelpers.trim({
        text: perk.name.toLowerCase(),
        fromEnd: ' (one-off)',
      });
      const wiki = perkWikis[name];

      if (!wiki) continue;

      perk.wikiLink = wiki.link;
    }
  }

  // spells
  {
    const spellWikis = await fetchWikiSpells();
    for (const spell of dataWak.spells) {
      const name = spell.name.toLowerCase();
      const wiki = spellWikis[name];

      if (!wiki) continue;

      spell.wikiLink = wiki.link;
    }
  }

  // enemies
  {
    const enemyWikis = await fetchWikiEnemies();
    for (const enemy of dataWak.enemies) {
      const name = enemy.name.toLowerCase();
      const wiki = enemyWikis[name];

      if (!wiki) continue;

      enemy.wikiLink = wiki.link;
    }
  }

  // materials
  {
    const materialWikis = await fetchWikiMaterials();
    for (const material of dataWak.materials) {
      const id = material.id;
      const wiki = materialWikis[id];

      if (!wiki) continue;

      material.wikiLink = wiki.link;
    }
  }

  writeDataWak(dataWak);
}
