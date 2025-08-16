import { JSDOM } from 'jsdom';

const wikiLinks = {
  enemies: 'https://noita.wiki.gg/wiki/Creatures',
  perks: 'https://noita.wiki.gg/wiki/Perks',
  spells: 'https://noita.wiki.gg/wiki/Spells',
};

async function fetchHtml(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const htmlString = await response.text();
  return new JSDOM(htmlString);
}

export async function fetchWikiEnemies() {
  const dom = await fetchHtml(wikiLinks.enemies);

  const enemyIteratable = dom.window.document
    .querySelectorAll('.enemy-query-item')
    .values();
  const enemyTags = Array.from(enemyIteratable);
  const scrapedEnemies: Record<string, { link: string }> = {};

  for (const enemyTag of enemyTags) {
    const linkTag = enemyTag.querySelector('.enemy-query-item-name a');
    if (!linkTag) continue;

    const link = linkTag.getAttribute('href');
    const name = linkTag.textContent.toLowerCase();

    scrapedEnemies[name] = { link };
  }

  return scrapedEnemies;
}

export async function fetchWikiPerks() {
  const dom = await fetchHtml(wikiLinks.perks);
  const perkIteratable =
    dom.window.document.querySelectorAll('.perk-query-item');
  const perkTags = Array.from(perkIteratable);
  const scrapedPerks: Record<string, { link: string }> = {};

  for (const perkTag of perkTags) {
    const linkTag = perkTag.querySelector('.perk-query-label a');
    if (!linkTag) continue;

    const link = linkTag.getAttribute('href');
    const name = linkTag.textContent.toLowerCase();

    scrapedPerks[name] = { link };
  }

  return scrapedPerks;
}

export async function fetchWikiSpells() {
  const dom = await fetchHtml(wikiLinks.spells);
  const spellIteratable = dom.window.document.querySelectorAll('.spellBorder');
  const spellTags = Array.from(spellIteratable);
  const scrapedSpells: Record<string, { link: string }> = {};

  for (const spellTag of spellTags) {
    const linkTag = spellTag.querySelector('a');
    if (!linkTag) continue;

    const link = linkTag.getAttribute('href');
    const name = linkTag.getAttribute('title').toLowerCase();

    scrapedSpells[name] = { link };
  }

  return scrapedSpells;
}
