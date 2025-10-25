import L from 'leaflet';
import { noitaDataWakManager } from '../../utils/noita-data-wak-manager.ts';
import { imageHelpers } from '@noita-explorer/tools';

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
