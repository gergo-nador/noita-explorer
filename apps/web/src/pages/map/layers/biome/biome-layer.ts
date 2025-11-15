import L from 'leaflet';
import { StreamInfoBackground } from '@noita-explorer/model-noita';
import {
  MapRendererPool,
  MapRendererWorker,
  Transfer,
} from '../../map-renderer-threads/threads-pool.types.ts';
import { mapConstants } from '@noita-explorer/map';
import { setErrorTile } from '../_shared/set-error-tile.ts';
import { createUnexploredTile } from '../_shared/create-unexplored-tile.ts';
import { ChunkInfoCollection } from '../../noita-map.types.ts';

export const BiomeLayer = L.GridLayer.extend({
  createTile: function (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const chunkInfos: ChunkInfoCollection = this.options.chunkInfos;
    const chunkInfo = chunkInfos[coords.x]?.[coords.y];

    if (!chunkInfo?.loaded) {
      const tile = createUnexploredTile({ coords, chunkInfos });

      // `done` needs to be called after returning
      setTimeout(() => done(undefined, tile), 0);

      return tile;
    }

    const tile = L.DomUtil.create('div', 'leaflet-tile');

    const canvas = document.createElement('canvas');
    canvas.style.imageRendering = 'pixelated';
    canvas.width = mapConstants.chunkWidth;
    canvas.height = mapConstants.chunkHeight;

    const allBackgrounds: Record<
      number,
      Record<number, StreamInfoBackground[]>
    > = this.options.backgrounds;

    const currentBackgrounds = allBackgrounds[coords.x]?.[coords.y] ?? [];

    const renderPool: MapRendererPool = this.options.renderPool;

    renderPool.queue((worker: MapRendererWorker) => {
      const offscreenCanvas = canvas.transferControlToOffscreen();

      worker
        .renderBiomeTile(
          {
            tileCoords: coords,
            backgrounds: currentBackgrounds,
          },
          Transfer(offscreenCanvas),
        )
        .then(() => tile.appendChild(canvas))
        .catch((err: unknown) => {
          console.error('error during biome tile render', err);
          setErrorTile(tile);
        })
        .then(() => done(undefined, tile));
    });

    return tile;
  },
});
