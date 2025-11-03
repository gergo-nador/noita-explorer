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

export const BiomeLayer = L.GridLayer.extend({
  createTile: function (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const tile = L.DomUtil.create('div', 'leaflet-tile');

    const streamInfo: StreamInfoFileFormat = this.options.streamInfo;
    const chunkInfo = streamInfo.chunkInfo.find(
      (chunk) => chunk.position.x === coords.x && chunk.position.y === coords.y,
    );

    if (!chunkInfo?.loaded) {
      if (coords.y >= 0) {
        const imageElement = document.createElement('img');
        imageElement.src = publicPaths.static.map.unexplored();
        imageElement.width = mapConstants.chunkWidth;
        imageElement.height = mapConstants.chunkHeight;
        imageElement.style.filter = 'brightness(0.5)';

        tile.appendChild(imageElement);
      }

      // `done` needs to be called after returning
      setTimeout(() => done(undefined, tile), 0);

      return tile;
    }

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
