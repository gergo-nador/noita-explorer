import L from 'leaflet';
import {
  NoitaWakBiomes,
  StreamInfoFileFormat,
} from '@noita-explorer/model-noita';
import { Vector2d } from '@noita-explorer/model';

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

    const chunkMinX = coords.x * 512;
    const chunkMaxX = (coords.x + 1) * 512;
    const chunkMinY = coords.y * 512;
    const chunkMaxY = (coords.y + 1) * 512;

    const backgrounds = streamInfo.backgrounds.filter((bg) => {
      if (bg.position.x < chunkMinX) return false;
      if (bg.position.x >= chunkMaxX) return false;
      if (bg.position.y < chunkMinY) return false;
      if (bg.position.y >= chunkMaxY) return false;

      return true;
    });

    const bgImagePath = biome.bgImagePath;

    async function render(ctx: CanvasRenderingContext2D) {
      if (bgImagePath && biome.loadBgImage) {
        const img = new Image();
        img.src = bgImagePath;

        await new Promise((resolve) => {
          img.onload = () => {
            for (let i = 0; i < 512; i += img.width) {
              for (let j = 0; j < 512; j += img.height) {
                ctx.drawImage(img, i, j);
                resolve(img);
              }
            }
          };
        });
      }

      if (backgrounds.length > 0) {
        for (const background of backgrounds) {
          const img = new Image();
          img.src = background.fileName;

          await new Promise((resolve) => {
            img.onload = () => {
              const relativeX = background.position.x % 512;
              const relativeY = background.position.y % 512;
              ctx.drawImage(img, relativeX, relativeY);
              resolve(img);
            };
          });
        }
      }
    }
    render(ctx).then(() => done(undefined, tile));

    tile.appendChild(canvas);
    return tile;
  },
});
