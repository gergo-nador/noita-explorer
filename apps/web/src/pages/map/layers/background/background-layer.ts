import L from 'leaflet';
import { CAVE_LIMIT_Y } from '@noita-explorer/map';
import { BackgroundThemes, noitaBgThemes } from './background-themes.ts';
import {
  MapRendererPool,
  MapRendererWorker,
  Transfer,
} from '../../map-renderer-threads/threads-pool.types.ts';
import { backgroundLayerSize } from './background-layer-size.ts';
import { setErrorTile } from '../_shared/set-error-tile.ts';

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

    if (coords.y >= 0) {
      setTimeout(() => done(undefined, tile), 0);
      return tile;
    }

    const canvas = document.createElement('canvas');
    canvas.style.imageRendering = 'pixelated';
    canvas.width = backgroundLayerSize.width;
    canvas.height = backgroundLayerSize.height;

    const userChosenBackgroundTheme = this.options
      .backgroundTheme as BackgroundThemes;

    const bgColors =
      noitaBgThemes[userChosenBackgroundTheme] ?? noitaBgThemes['dayStart'];

    const renderPool: MapRendererPool = this.options.renderPool;
    renderPool.queue((worker: MapRendererWorker) => {
      const offscreenCanvas = canvas.transferControlToOffscreen();

      worker
        .renderBackgroundTile(
          {
            coords,
            theme: bgColors,
          },
          Transfer(offscreenCanvas),
        )
        .then(() => {
          tile.appendChild(canvas);
          done(undefined, tile);
        })
        .catch((err: Error) => {
          console.error('error during biome tile render', err);
          setErrorTile(tile);
          done(err, tile);
        });
    });

    return tile;
  },
});
