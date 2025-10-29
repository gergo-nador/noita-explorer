import L from 'leaflet';
import { CAVE_LIMIT_Y } from '@noita-explorer/map';

export const NoitaBackgroundLayer = L.GridLayer.extend({
  _getTilePos: function (coords: L.Coords) {
    // move background bottom to the cave limit for a smooth transition
    return coords.scaleBy(this.getTileSize()).add(L.point(0, CAVE_LIMIT_Y));
  },
  createTile: function (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const tile = L.DomUtil.create('div', 'leaflet-tile');

    if (coords.y !== -1) {
      done(undefined, tile);
      return tile;
    }

    const tileWidth = 512 * 4;
    const tileHeight = 512 * 2;

    const canvas = document.createElement('canvas');
    canvas.width = tileWidth;
    canvas.height = tileHeight;

    async function render() {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('NoitaBackgroundLayer is not supported');
      }

      await new Promise((resolve) => {
        const imgClouds1 = new Image();
        imgClouds1.src = '/data/weather_gfx/parallax_clounds_01.png';

        imgClouds1.onload = () => {
          ctx.drawImage(
            imgClouds1,
            0,
            0,
            imgClouds1.width,
            imgClouds1.height,
            0,
            0,
            tileWidth,
            tileHeight,
          );
          resolve(1);
        };
      });

      const imgMountains1 = new Image();
      imgMountains1.src = '/data/weather_gfx/parallax_mountains_layer_01.png';

      const imgMountains2 = new Image();
      imgMountains2.src = '/data/weather_gfx/parallax_mountains_layer_02.png';

      const imgMountains3 = new Image();
      imgMountains3.src = '/data/weather_gfx/parallax_mountains_02.png';

      const imgClouds2 = new Image();
      imgClouds2.src = '/data/weather_gfx/parallax_clounds_02.png';
      /*
      await new Promise((resolve) => {
        imgMountains3.onload = () => {
          ctx.drawImage(
            imgMountains3,
            0,
            0,
            imgMountains3.width,
            imgMountains3.height,
            0,
            0,
            tileWidth,
            tileHeight,
          );
          resolve(1);
        };
      });

      await new Promise((resolve) => {
        imgClouds2.onload = () => {
          ctx.drawImage(
            imgClouds2,
            0,
            0,
            imgClouds2.width,
            imgClouds2.height,
            0,
            0,
            tileWidth,
            tileHeight,
          );
          resolve(1);
        };
      });
      */

      /*
      await new Promise((resolve) => {
        imgMountains1.onload = () => {
          ctx.drawImage(
            imgMountains1,
            0,
            0,
            imgMountains1.width,
            imgMountains1.height,
            0,
            0,
            tileWidth,
            tileHeight,
          );
          resolve(1);
        };
      });*/
      /*
      await new Promise((resolve) => {
        imgMountains2.onload = () => {
          ctx.drawImage(
            imgMountains2,
            0,
            0,
            imgMountains2.width,
            imgMountains2.height,
            0,
            0,
            tileWidth,
            tileHeight,
          );
          resolve(1);
        };
      });

       */
    }

    render().then(() => done(undefined, tile));
    tile.appendChild(canvas);

    return tile;
  },
});
