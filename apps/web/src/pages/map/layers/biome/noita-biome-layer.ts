import L from 'leaflet';
import { noitaDataWakManager } from '../../utils/noita-data-wak-manager.ts';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { imageHelpers } from '@noita-explorer/tools';
import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';

const dataPromise = noitaDataWakManager.getDataWak().then(async (dataWak) => {
  const biomesAllFile = await dataWak.getFile('data/biome/_biomes_all.xml');
  const biomes = await readBiomes({ biomesAllFile, dataWak });

  const biomeMapFile = await dataWak.getFile(biomes.biomeImageMapPath);
  const biomeImageMap = await readBiomeImageMapRaw({ biomeMapFile });

  return { biomeImageMap, biomes, dataWak };
});

export const NoitaBiomeLayer = L.GridLayer.extend({
  createTile: function (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const tile = L.DomUtil.create('div', 'leaflet-tile');

    if (coords.y < 0) {
      //sky
      done(undefined, tile);
      return tile;
    }

    dataPromise.then(async ({ biomeImageMap, biomes, dataWak }) => {
      const color = biomeImageMap.colors[coords.y + 14]?.[coords.x + 35];
      if (color === undefined) {
        console.log('biome color not found', coords);
        tile.innerHTML = '';
        done(new Error('nope'), tile);
        return;
      }

      const biome = biomes.biomes.find(
        (b) => b.color.toUpperCase() === color.toUpperCase(),
      );

      if (!biome) {
        console.log('biome not found', coords);
        tile.innerHTML = '';
        done(new Error('nope'), tile);
        return;
      }

      if (!biome.bgImagePath) {
        console.log('biome no bg image', biome);
        tile.innerHTML = '';
        done(new Error('nope'), tile);
        return;
      }

      const bgImageFile = await dataWak.getFile(biome.bgImagePath);
      const base64 = await bgImageFile.read.asImageBase64();
      const imageData = await imageHelpers.base64ToImageData(base64);
      // @ts-expect-error afaerfa
      const imageBitmap = await window.createImageBitmap(imageData);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.log('no ctx', biome);
        tile.innerHTML = '';
        done(new Error('nope'), tile);
        return;
      }

      canvas.width = 512;
      canvas.height = 512;

      const { width, height } = await imageHelpers.getImageSizeBase64(base64);

      for (let i = 0; i < 512; i += width) {
        for (let j = 0; j < 512; j += height) {
          ctx.drawImage(imageBitmap, i, j);
        }
      }
      tile.style.backgroundImage = `url("${base64}")`;
      tile.style.backgroundRepeat = 'repeat';
      done(undefined, tile);
    });

    return tile;
  },
});

async function readBiomes({
  biomesAllFile,
  dataWak,
}: {
  biomesAllFile: FileSystemFileAccess;
  dataWak: FileSystemDirectoryAccess;
}) {
  const allBiomesText = await biomesAllFile.read.asText();
  const xmlObj = await parseXml(allBiomesText);
  const xml = XmlWrapper(xmlObj);

  const biomesToLoadTag = xml.findNthTag('BiomesToLoad');
  if (!biomesToLoadTag) {
    throw new Error('Expected BiomesToLoad tag to be found.');
  }

  const biomeImageMapPath = biomesToLoadTag
    .getRequiredAttribute('biome_image_map')
    .asText();

  const biomeTags = biomesToLoadTag.findTagArray('Biome');
  const biomes = [];

  for (const biomeTag of biomeTags) {
    const color = biomeTag.getRequiredAttribute('color').asText();

    const biomeFileName = biomeTag
      .getRequiredAttribute('biome_filename')
      .asText();

    const biomeFile = await dataWak.getFile(biomeFileName);
    const biomeText = await biomeFile.read.asText();
    const biomeXmlObj = await parseXml(biomeText);
    const biomeXml = XmlWrapper(biomeXmlObj);

    const topologyTag = biomeXml.findNthTag('Topology');
    if (!topologyTag) continue;

    const bgImagePath = topologyTag.getAttribute('background_image')?.asText();

    biomes.push({ color, bgImagePath, biomeFileName });
  }

  return { biomeImageMapPath, biomes };
}

async function readBiomeImageMapRaw({
  biomeMapFile,
}: {
  biomeMapFile: FileSystemFileAccess;
}) {
  const base64Image = await biomeMapFile.read.asImageBase64();
  const imageData = await imageHelpers.base64ToImageData(base64Image);

  const colors: string[][] = [];
  let currentRow: string[] = [];

  for (let j = 0; j < imageData.height; j++) {
    currentRow = [];
    for (let i = 0; i < imageData.width; i++) {
      const offset = (j * imageData.width + i) * 4;

      const r = imageData.data[offset];
      const g = imageData.data[offset + 1];
      const b = imageData.data[offset + 2];
      const a = imageData.data[offset + 3];

      const argb = (a << 24) | (r << 16) | (g << 8) | b;
      const unsignedArgb = argb >>> 0;

      const colorString = unsignedArgb.toString(16);

      if (j === 15 && i === 43) debugger;
      //if (j - 14 === 2 && i - 35 === 9) debugger;

      currentRow.push(colorString);
    }

    colors.push(currentRow);
  }

  return { colors };
}
