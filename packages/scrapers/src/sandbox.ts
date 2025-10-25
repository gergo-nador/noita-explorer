import fs from 'fs';
import { FileSystemDirectoryAccessDataWakMemory } from '@noita-explorer/file-systems/data-wak-memory-fs';
import { scrapeBiome } from './scrapers/datawak/biomes/scrape-biome.ts';

const buffer = fs.readFileSync(
  '/Users/gergo.nador/noita-explorer/apps/web/dist-tmp/data.wak',
);
const dir = FileSystemDirectoryAccessDataWakMemory(buffer);
dir
  .getFile('data/biome/mountain_left_entrance.xml')
  .then(async (leftEntrance) => {
    await scrapeBiome({
      dataWakParentDirectoryApi: dir,
      biomeFile: leftEntrance,
    });
  });
