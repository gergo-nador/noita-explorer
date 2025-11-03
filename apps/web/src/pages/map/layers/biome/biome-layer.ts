import L from 'leaflet';
import {
  StreamInfoBackground,
  StreamInfoFileFormat,
} from '@noita-explorer/model-noita';
import {
  MapRendererPool,
  MapRendererWorker,
  Transfer,
} from '../../map-renderer-threads/threads-pool.types.ts';
import { mapConstants } from '@noita-explorer/map';
import { publicPaths } from '../../../../utils/public-paths.ts';
import { setErrorTile } from '../_shared/set-error-tile.ts';

export const BiomeLayer = L.GridLayer.extend({
  createTile: function (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const streamInfo: StreamInfoFileFormat = this.options.streamInfo;
    const chunkInfo = streamInfo.chunkInfo.find(
      (chunk) => chunk.position.x === coords.x && chunk.position.y === coords.y,
    );

    if (!chunkInfo?.loaded) {
      const imgTile = L.DomUtil.create('img', 'leaflet-tile');
      if (coords.y >= 0) {
        imgTile.src = publicPaths.static.map.unexplored();
        imgTile.width = mapConstants.chunkWidth;
        imgTile.height = mapConstants.chunkHeight;
        imgTile.style.filter = 'brightness(0.5)';
      }

      // `done` needs to be called after returning
      setTimeout(() => done(undefined, imgTile), 0);

      return imgTile;
    }

    const tile = L.DomUtil.create('div', 'leaflet-tile');

    const canvas = document.createElement('canvas');
    canvas.style.imageRendering = 'pixelated';
    canvas.width = mapConstants.chunkWidth;
    canvas.height = mapConstants.chunkHeight;

    const chunkLeftBorderX = coords.x * mapConstants.chunkWidth;
    const chunkRightBorderX = (coords.x + 1) * mapConstants.chunkWidth;
    const chunkTopBorderY = coords.y * mapConstants.chunkHeight;
    const chunkBottomBorderY = (coords.y + 1) * mapConstants.chunkHeight;

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
            biomeCoords: coords,
            backgrounds: currentBackgrounds,
            chunkBorders: {
              leftX: chunkLeftBorderX,
              rightX: chunkRightBorderX,
              topY: chunkTopBorderY,
              bottomY: chunkBottomBorderY,
            },
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
