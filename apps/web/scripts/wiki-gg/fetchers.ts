import { JSDOM } from 'jsdom';

const wikiBaseUrl = 'https://noita.wiki.gg';

const wikiLinks = {
  enemies: wikiBaseUrl + '/wiki/Creatures',
  perks: wikiBaseUrl + '/wiki/Perks',
  spells: wikiBaseUrl + '/wiki/Spells',
  materials: wikiBaseUrl + '/wiki/Materials',
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

  const enemyIterable = dom.window.document
    .querySelectorAll('.enemy-query-item')
    .values();
  const enemyTags = Array.from(enemyIterable);
  const scrapedEnemies: Record<string, { link: string }> = {};

  for (const enemyTag of enemyTags) {
    const linkTag = enemyTag.querySelector('.enemy-query-item-name a');
    if (!linkTag) continue;

    const link = wikiBaseUrl + linkTag.getAttribute('href');
    const name = linkTag.textContent.toLowerCase();

    scrapedEnemies[name] = { link };
  }

  return scrapedEnemies;
}

export async function fetchWikiPerks() {
  const dom = await fetchHtml(wikiLinks.perks);
  const perkIterable = dom.window.document.querySelectorAll('.perk-query-item');
  const perkTags = Array.from(perkIterable);
  const scrapedPerks: Record<string, { link: string }> = {};

  for (const perkTag of perkTags) {
    const linkTag = perkTag.querySelector('.perk-query-label a');
    if (!linkTag) continue;

    const link = wikiBaseUrl + linkTag.getAttribute('href');
    const name = linkTag.textContent.toLowerCase();

    scrapedPerks[name] = { link };
  }

  return scrapedPerks;
}

export async function fetchWikiSpells() {
  const dom = await fetchHtml(wikiLinks.spells);
  const spellIterable = dom.window.document.querySelectorAll('.spellBorder');
  const spellTags = Array.from(spellIterable);
  const scrapedSpells: Record<string, { link: string }> = {};

  for (const spellTag of spellTags) {
    const linkTag = spellTag.querySelector('a');
    if (!linkTag) continue;

    const link = wikiBaseUrl + linkTag.getAttribute('href');
    const name = linkTag.getAttribute('title').toLowerCase();

    scrapedSpells[name] = { link };
  }

  return scrapedSpells;
}

export async function fetchWikiMaterials() {
  const dom = await fetchHtml(wikiLinks.materials);
  const materialIterable = dom.window.document.querySelectorAll(
    '.material-query-item',
  );
  const materialTags = Array.from(materialIterable);
  const scrapedMaterials: Record<string, { link: string }> = {};

  for (const materialTag of materialTags) {
    const linkTag = materialTag.querySelector('.material-query-label .name a');
    const idTag = materialTag.querySelector('.id code');
    if (!linkTag || !idTag) continue;

    const link = wikiBaseUrl + linkTag.getAttribute('href');
    const id = idTag.textContent;

    scrapedMaterials[id] = { link };
  }

  return scrapedMaterials;
}
