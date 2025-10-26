import L from 'leaflet';
import {
  NoitaWakBiomes,
  StreamInfoFileFormat,
} from '@noita-explorer/model-noita';
import { noitaDataWakManager } from '../../utils/noita-data-wak-manager.ts';

export const NoitaBiomeLayer = L.GridLayer.extend({
  createTile: function (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const tile = L.DomUtil.create('div', 'leaflet-tile');

    //if (coords.y < 0) {
    //  //sky
    //  done(undefined, tile);
    //  return tile;
    //}

    const wakBiomes: NoitaWakBiomes = this.options.biomes;
    const biomeIndex =
      wakBiomes.biomeMap.biomeIndices[
        coords.y + wakBiomes.biomeMap.biomeOffset.y
      ]?.[coords.x + wakBiomes.biomeMap.biomeOffset.x];

    if (biomeIndex === undefined) {
      return tile;
    }

    const biome = wakBiomes.biomes[biomeIndex];
    if (!biome) {
      console.error('biome not found', coords);
      tile.innerHTML = '';
      done(new Error('nope'), tile);
      return tile;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      tile.innerHTML = '';
      done(new Error('nope'), tile);
      return tile;
    }

    const streamInfo: StreamInfoFileFormat = this.options.streamInfo;

    const chunkMinX = coords.x * 512;
    const chunkMaxX = (coords.x + 1) * 512;
    const chunkMinY = coords.y * 512;
    const chunkMaxY = (coords.y + 1) * 512;

    const backgrounds = streamInfo.backgrounds.filter((bg) => {
      if (bg.position.x < chunkMinX) return false;
      if (bg.position.x >= chunkMaxX) return false;
      if (bg.position.y < chunkMinY) return false;
      if (bg.position.y >= chunkMaxY) return false;

      return true;
    });

    noitaDataWakManager
      .getDataWak()
      .then(async (dataWak) => {
        const bgImagePath = biome.bgImagePath;

        if (bgImagePath && biome.loadBgImage) {
          const bgImageFile = await dataWak.getFile(bgImagePath);
          const base64 = await bgImageFile.read.asImageBase64();

          const img = new Image();
          img.src = base64;

          await new Promise((resolve) => {
            img.onload = () => {
              for (let i = 0; i < 512; i += img.width) {
                for (let j = 0; j < 512; j += img.height) {
                  ctx.drawImage(img, i, j);
                }
              }

              resolve(img);
            };
          });
        }

        if (backgrounds.length > 0) {
          for (const background of backgrounds) {
            const bgImageFile = await dataWak.getFile(background.fileName);
            const base64 = await bgImageFile.read.asImageBase64();

            const img = new Image();
            img.src = base64;

            await new Promise((resolve) => {
              img.onload = () => {
                const relativeX = background.position.x % 512;
                const relativeY = background.position.y % 512;
                ctx.drawImage(img, relativeX, relativeY);
                resolve(img);
              };
            });
          }
        }
      })
      .then(() => done(undefined, tile));

    tile.appendChild(canvas);
    return tile;
  },
});
