import L from 'leaflet';
import { CAVE_LIMIT_Y } from '@noita-explorer/map';
import { CSSProperties } from 'react';
import { noitaBgThemes } from './background-themes.ts';

const tileWidth = 512 * 8;
const tileHeight = 512 * 4;

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

    if (coords.y !== -1) {
      done(undefined, tile);
      return tile;
    }

    const canvas = document.createElement('canvas');
    canvas.style.imageRendering = 'pixelated';
    canvas.width = tileWidth;
    canvas.height = tileHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('NoitaBackgroundLayer is not supported');
    }

    ctx.imageSmoothingEnabled = false;

    const bgColors = noitaBgThemes['day'];

    ctx.fillStyle = bgColors.background;
    ctx.fillRect(coords.x, coords.y, canvas.width, canvas.height);

    renderBackgroundImage({
      src: '/data/weather_gfx/parallax_clounds_01.png',
      color: bgColors.cloud1,
      colorRenderMode: 'clouds',
    })
      .then((canvas) => ctx.drawImage(canvas, 0, 0))
      .then(() =>
        renderBackgroundImage({
          src: '/data/weather_gfx/parallax_mountains_02.png',
          color: bgColors.mountain2,
          colorRenderMode: 'mountain',
        }),
      )
      .then((canvas) => ctx.drawImage(canvas, 0, 0))
      .then(() =>
        renderBackgroundImage({
          src: '/data/weather_gfx/parallax_clounds_02.png',
          color: bgColors.cloud2,
          colorRenderMode: 'clouds',
        }),
      )
      .then((canvas) => ctx.drawImage(canvas, 0, 0))
      .then(() =>
        renderBackgroundImage({
          src: '/data/weather_gfx/parallax_mountains_layer_02.png',
          color: bgColors.mountain1Back,
          colorRenderMode: 'mountain',
        }),
      )
      .then((canvas) => ctx.drawImage(canvas, 0, 0))
      .then(() =>
        renderBackgroundImage({
          src: '/data/weather_gfx/parallax_mountains_layer_01.png',
          color: bgColors.mountain1Highlight,
          colorRenderMode: 'mountain',
        }),
      )
      .then((canvas) => ctx.drawImage(canvas, 0, 0))
      .then(() => done(undefined, tile));

    tile.appendChild(canvas);

    return tile;
  },
});

async function renderBackgroundImage({
  src,
  color,
  colorRenderMode,
}: {
  src: string;
  color: NonNullable<CSSProperties['color']>;
  colorRenderMode: 'clouds' | 'mountain';
}) {
  const canvas = document.createElement('canvas');
  canvas.style.imageRendering = 'pixelated';
  canvas.width = tileWidth;
  canvas.height = tileHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('CanvasRenderingContext2D is not supported');
  }

  ctx.imageSmoothingEnabled = false;

  // 1. fill the whole canvas with the color the image should have
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      if (colorRenderMode === 'clouds') {
        // 2. mix the img and the chosen color
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          0,
          0,
          tileWidth,
          tileHeight,
        );
      }

      // 3. mask the canvas
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        tileWidth,
        tileHeight,
      );

      resolve(1);
    };
  });

  return canvas;
}
