import L from 'leaflet';
import { CAVE_LIMIT_Y, mapConstants } from '@noita-explorer/map';
import { noitaBgThemes } from './background-themes.ts';
import {
  MapRendererPool,
  MapRendererWorker,
  Transfer,
} from '../../map-renderer-threads/threads-pool.types.ts';
import { publicPaths } from '../../../../utils/public-paths.ts';
import { backgroundLayerSize } from './background-layer-size.ts';

export const BackgroundLayer = L.GridLayer.extend({
  _getTilePos: function (coords: L.Coords) {
    const generousCaveLimitY = CAVE_LIMIT_Y + 50;
    // move background bottom to the cave limit for a smooth transition
    return coords
      .scaleBy(this.getTileSize())
      .add(L.point(0, generousCaveLimitY));
  },
  createTile: function (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const tile = L.DomUtil.create('div', 'leaflet-tile');

    if (coords.y > -1) {
      done(undefined, tile);
      return tile;
    }

    const canvas = document.createElement('canvas');
    canvas.style.imageRendering = 'pixelated';
    canvas.width = backgroundLayerSize.width;
    canvas.height = backgroundLayerSize.height;

    const bgColors = noitaBgThemes['nightMid'];

    const renderPool: MapRendererPool = this.options.renderPool;
    renderPool.queue((worker: MapRendererWorker) => {
      const offscreenCanvas = canvas.transferControlToOffscreen();

      worker
        .renderBackgroundTile(
          {
            coords,
            size: { x: canvas.width, y: canvas.height },
            theme: bgColors,
          },
          Transfer(offscreenCanvas),
        )
        .then(() => tile.appendChild(canvas))
        .catch((err: unknown) => {
          console.error('error during biome tile render', err);
          const imageElement = document.createElement('img');
          imageElement.src = publicPaths.static.map.tileError();
          imageElement.width = mapConstants.chunkWidth;
          imageElement.height = mapConstants.chunkHeight;

          tile.appendChild(imageElement);
        })
        .then(() => done(undefined, tile));
    });

    return tile;
  },
});
