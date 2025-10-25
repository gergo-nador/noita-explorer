import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { noitaPaths } from '../../../noita-paths.ts';
import { scrapeBiome } from './scrape-biome.ts';
import { scrapeBiomeImageMap } from './scrape-biome-image-map.ts';
import { NoitaBiomeMap, NoitaWakBiomes } from '@noita-explorer/model-noita';

export const scrapeBiomes = async ({
  dataWakParentDirectoryApi,
}: {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}): Promise<NoitaWakBiomes> => {
  const biomesAllPath = await dataWakParentDirectoryApi.path.join(
    noitaPaths.noitaDataWak.xmlData.materials,
  );
  const biomesAllFile = await dataWakParentDirectoryApi.getFile(biomesAllPath);

  const allBiomesText = await biomesAllFile.read.asText();
  const xmlObj = await parseXml(allBiomesText);
  const xml = XmlWrapper(xmlObj);

  const biomesToLoadTag = xml.findNthTag('BiomesToLoad');
  if (!biomesToLoadTag) {
    throw new Error('Expected BiomesToLoad tag to be found.');
  }

  // 1. Step: get all biomes from the list
  const biomeTags = biomesToLoadTag.findTagArray('Biome');
  const biomesWithColor = [];

  for (const biomeTag of biomeTags) {
    const color = biomeTag.getRequiredAttribute('color').asText();

    const biomeFileName = biomeTag
      .getRequiredAttribute('biome_filename')
      .asText();

    const biomeFile = await dataWakParentDirectoryApi.getFile(biomeFileName);
    const biome = await scrapeBiome({ biomeFile, dataWakParentDirectoryApi });

    if (!biome) continue;

    biomesWithColor.push({ color, biome });
  }

  // 2. Step: read the biome image map
  const biomeImageMapPath = biomesToLoadTag
    .getRequiredAttribute('biome_image_map')
    .asText();

  const biomeMapFile =
    await dataWakParentDirectoryApi.getFile(biomeImageMapPath);

  const biomeMapRaw = await scrapeBiomeImageMap({ biomeMapFile });

  // 3. Step: find zero chunk
  const halfWidth = biomeMapRaw.width / 2;
  const biomeOffsetX =
    biomesToLoadTag.getAttribute('biome_offset_x')?.asInt() ?? halfWidth;

  const halfHeight = biomeMapRaw.height / 2;
  const biomeOffsetY =
    biomesToLoadTag.getAttribute('biome_offset_y')?.asInt() ?? halfHeight;

  // 4. Step: make biome data easily usable
  const biomeIndices: number[][] = [];
  for (let i = 0; i < biomeMapRaw.height; i++) {
    const row: number[] = [];

    for (let j = 0; j < biomeMapRaw.width; j++) {
      const color = biomeMapRaw.colors[i][j];

      const biomeIndex = biomesWithColor.findIndex((b) => b.color === color);
      if (biomeIndex === -1) {
        throw new Error(`Could not find biome with color "${color}"`);
      }

      row.push(biomeIndex);
    }

    biomeIndices.push(row);
  }

  // 5. Step: final touches
  const biomeMap: NoitaBiomeMap = {
    biomeOffset: { x: biomeOffsetX, y: biomeOffsetY },
    biomeIndices,
  };

  const biomes = biomesWithColor.map((biome) => biome.biome);

  return { biomeMap, biomes };
};
