import L from 'leaflet';
import { CAVE_LIMIT_Y } from '@noita-explorer/map';
import { noitaBgThemes } from './background-themes.ts';
import {
  MapRendererPool,
  MapRendererWorker,
} from '../../map-renderer-threads/threads-pool.types.ts';

const tileWidth = 512 * 12;
const tileHeight = 512 * 6;

export const NoitaBackgroundLayer = L.GridLayer.extend({
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
    canvas.width = tileWidth;
    canvas.height = tileHeight;

    tile.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('NoitaBackgroundLayer is not supported');
    }

    ctx.imageSmoothingEnabled = false;

    const bgColors = noitaBgThemes['nightMid'];

    const renderPool: MapRendererPool = this.options.renderPool;
    console.log('renderPool', renderPool);
    renderPool.queue((worker: MapRendererWorker) => {
      worker
        .renderBackgroundTile({
          coords,
          size: { x: canvas.width, y: canvas.height },
          theme: bgColors,
        })
        .then((imageData: ImageData | undefined) => {
          if (imageData) ctx.putImageData(imageData, 0, 0);
        })
        .then(() => done(undefined, tile));
    });

    return tile;
  },
});
