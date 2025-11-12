import L from 'leaflet';
import { NoitaPetriFileCollection } from '../../noita-map.types.ts';
import {
  MapRendererPool,
  MapRendererWorker,
  Transfer,
} from '../../map-renderer-threads/threads-pool.types.ts';
import { setErrorTile } from '../_shared/set-error-tile.ts';
import { WebTransferable } from '@noita-explorer/model';

export const TerrainLayer = L.GridLayer.extend({
  createTile: function (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const tile = L.DomUtil.create('div', 'leaflet-tile');

    const petriFiles: NoitaPetriFileCollection = this.options.petriFiles;
    const petriFile = petriFiles?.[coords.x]?.[coords.y];

    if (!petriFile) {
      tile.innerHTML = '';
      done(undefined, tile);
      return tile;
    }

    const renderPool: MapRendererPool = this.options.renderPool;

    const canvas = document.createElement('canvas');
    canvas.style.imageRendering = 'pixelated';
    canvas.width = 512;
    canvas.height = 512;

    renderPool
      .queue(async (worker: MapRendererWorker) => {
        let transferable = petriFile.supportsTransferable();
        // fallback: read file as buffer
        if (!transferable) {
          const array: Uint8Array = await petriFile.read.asBuffer();
          transferable = Transfer(array.buffer);
        }

        const offscreenCanvas = canvas.transferControlToOffscreen();

        return worker.renderTerrainTile(
          {
            chunkCoordinates: coords,
          },
          Transfer(offscreenCanvas),
          transferable as WebTransferable,
        );
      })
      .then(() => tile.appendChild(canvas))
      .catch((err: unknown) => {
        console.error('error during biome tile render', err);
        setErrorTile(tile);
      })
      .then(() => done(undefined, tile));

    return tile;
  },
});
