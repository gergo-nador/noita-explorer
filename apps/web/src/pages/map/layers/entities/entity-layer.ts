import L from 'leaflet';
import {
  ChunkInfoCollection,
  Map2dOrganizedObject,
} from '../../noita-map.types.ts';
import { ChunkRenderableEntitySprite, mapConstants } from '@noita-explorer/map';
import {
  MapRendererPool,
  MapRendererWorker,
  Transfer,
} from '../../map-renderer-threads/threads-pool.types.ts';
import { setErrorTile } from '../_shared/set-error-tile.ts';

export const EntityLayer = L.GridLayer.extend({
  createTile: function (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const chunkInfos: ChunkInfoCollection = this.options.chunkInfos;
    const chunkInfo = chunkInfos[coords.x]?.[coords.y];

    if (!chunkInfo?.loaded) {
      const tile = L.DomUtil.create('div', 'leaflet-tile');

      // `done` needs to be called after returning
      setTimeout(() => done(undefined, tile), 0);

      return tile;
    }

    const tile = L.DomUtil.create('div', 'leaflet-tile');

    const canvas = document.createElement('canvas');
    canvas.style.imageRendering = 'pixelated';
    canvas.width = mapConstants.chunkWidth;
    canvas.height = mapConstants.chunkHeight;

    const renderPool: MapRendererPool = this.options.renderPool;
    const foregroundEntities: Map2dOrganizedObject<
      ChunkRenderableEntitySprite[]
    > = this.options.foregroundEntities;

    const chunkEntities = foregroundEntities?.[coords.x]?.[coords.y] ?? [];

    renderPool.queue((worker: MapRendererWorker) => {
      const offscreenCanvas = canvas.transferControlToOffscreen();

      worker
        .renderEntityTile(
          {
            tileCoords: coords,
            entities: chunkEntities,
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
