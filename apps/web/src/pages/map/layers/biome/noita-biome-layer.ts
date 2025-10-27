import L from 'leaflet';
import {
  NoitaWakBiomes,
  StreamInfoFileFormat,
} from '@noita-explorer/model-noita';
import { Vector2d } from '@noita-explorer/model';
import { MapRenderType } from '../../../../workers-web/map/map-render.types.ts';
// @ts-expect-error threads module is installed
import { Pool } from 'threads';

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

    const wakBiomes: NoitaWakBiomes = this.options.biomes;
    function getBiome({ x, y }: Vector2d) {
      y = Math.max(y, -wakBiomes.biomeMap.biomeOffset.y);

      const biomeIndex =
        wakBiomes.biomeMap.biomeIndices[y + wakBiomes.biomeMap.biomeOffset.y]?.[
          x + wakBiomes.biomeMap.biomeOffset.x
        ];

      return wakBiomes.biomes[biomeIndex];
    }

    const biome = getBiome(coords);
    if (!biome) {
      console.error('biome not found', coords);
      tile.innerHTML = '';
      done(new Error('nope'), tile);
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

    const backgrounds = streamInfo.backgrounds.filter((bg) => {
      if (bg.position.x < chunkLeftBorderX) return false;
      if (bg.position.x >= chunkRightBorderX) return false;
      if (bg.position.y < chunkTopBorderY) return false;
      if (bg.position.y >= chunkBottomBorderY) return false;

      return true;
    });

    const renderPool: Pool<MapRenderType> = this.options.renderPool;
    renderPool.queue((worker) => {
      worker
        .renderBiomeTile({
          biome,
          chunkBorders: {
            leftX: chunkLeftBorderX,
            rightX: chunkRightBorderX,
            topY: chunkTopBorderY,
            bottomY: chunkBottomBorderY,
          },
        })
        .then((imageData: ImageData) => {
          ctx.putImageData(imageData, 0, 0);
        })
        .then(() => done(undefined, tile));
    });

    tile.appendChild(canvas);
    return tile;
  },
});
