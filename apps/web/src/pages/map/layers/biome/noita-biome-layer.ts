import L from 'leaflet';
import { NoitaWakBiomes } from '@noita-explorer/model-noita';
import { noitaDataWakManager } from '../../utils/noita-data-wak-manager.ts';

export const NoitaBiomeLayer = L.GridLayer.extend({
  createTile: function (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const tile = L.DomUtil.create('div', 'leaflet-tile');

    if (coords.y < 0) {
      //sky
      done(undefined, tile);
      return tile;
    }

    const wakBiomes: NoitaWakBiomes = this.options.biomes;
    const biomeIndex =
      wakBiomes.biomeMap.biomeIndices[
        coords.y + wakBiomes.biomeMap.biomeOffset.y
      ]?.[coords.x + wakBiomes.biomeMap.biomeOffset.x];

    if (!biomeIndex) {
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

    const promises: Promise<unknown>[] = [];

    const bgImagePath = biome.bgImagePath;
    if (bgImagePath && biome.loadBgImage) {
      const promise = noitaDataWakManager.getDataWak().then(async (dataWak) => {
        const bgImageFile = await dataWak.getFile(bgImagePath);
        const base64 = await bgImageFile.read.asImageBase64();

        const bgImageDivElement = document.createElement('div');
        bgImageDivElement.style.width = '100%';
        bgImageDivElement.style.height = '100%';
        bgImageDivElement.style.backgroundImage = `url("${base64}")`;
        bgImageDivElement.style.backgroundRepeat = 'repeat';

        tile.appendChild(bgImageDivElement);
      });

      promises.push(promise);
    }

    if (promises.length === 0) {
      done(undefined, tile);
    }

    Promise.all(promises).then(() => done(undefined, tile));

    return tile;
  },
});
