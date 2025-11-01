import L from 'leaflet';
import {
  StreamInfoBackground,
  StreamInfoFileFormat,
} from '@noita-explorer/model-noita';
import {
  MapRendererPool,
  MapRendererWorker,
} from '../../map-renderer-threads/threads-pool.types.ts';

export const NoitaBiomeLayer = L.GridLayer.extend({
  createTile: function (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const tile = L.DomUtil.create('div', 'leaflet-tile');

    const streamInfo: StreamInfoFileFormat = this.options.streamInfo;
    const chunkInfo = streamInfo.chunkInfo.find(
      (chunk) => chunk.position.x === coords.x && chunk.position.y === coords.y,
    );

    if (!chunkInfo?.loaded) {
      tile.innerHTML = '';
      done(undefined, tile);
      return tile;
    }

    const canvas = document.createElement('canvas');
    canvas.style.imageRendering = 'pixelated';
    canvas.width = 512;
    canvas.height = 512;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      tile.innerHTML = '';
      done(new Error('nope'), tile);
      return tile;
    }

    const chunkLeftBorderX = coords.x * 512;
    const chunkRightBorderX = (coords.x + 1) * 512;
    const chunkTopBorderY = coords.y * 512;
    const chunkBottomBorderY = (coords.y + 1) * 512;

    const allBackgrounds: Record<
      number,
      Record<number, StreamInfoBackground[]>
    > = this.options.backgrounds;

    const currentBackgrounds = allBackgrounds[coords.x]?.[coords.y] ?? [];

    const renderPool: MapRendererPool = this.options.renderPool;

    renderPool.queue((worker: MapRendererWorker) => {
      worker
        .renderBiomeTile({
          biomeCoords: coords,
          backgrounds: currentBackgrounds,
          chunkBorders: {
            leftX: chunkLeftBorderX,
            rightX: chunkRightBorderX,
            topY: chunkTopBorderY,
            bottomY: chunkBottomBorderY,
          },
        })
        .then((image: ImageBitmap | undefined) => {
          if (image) ctx.drawImage(image, 0, 0);
        })
        .then(() => done(undefined, tile));
    });

    tile.appendChild(canvas);
    return tile;
  },
});
