import { Vector2d } from '@noita-explorer/model';
import { renderBackgroundImage } from './render-background-image.ts';
import { NoitaBackgroundTheme } from '../../interfaces/noita-background-theme.ts';
import { renderBackgroundStars } from './render-background-stars.ts';

interface Props {
  coords: Vector2d;
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  theme: NoitaBackgroundTheme;
}

export async function renderBackgroundTile({ coords, ctx, theme }: Props) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.imageSmoothingEnabled = false;

  // the mountain images has around 1024 pixel width
  const starSizeMultiplier = ctx.canvas.width / 1024;

  if (coords.y === -1) {
    const gradient = ctx.createLinearGradient(0, height, 0, 0);

    gradient.addColorStop(0, theme.secondaryBackground);
    gradient.addColorStop(0.5, theme.secondaryBackground);
    gradient.addColorStop(1, theme.background);

    ctx.fillStyle = gradient;
    ctx.fillRect(coords.x, coords.y, width, height);

    if (theme.hasStars) {
      await renderBackgroundStars({ ctx, starSizeMultiplier });
    }

    const size = { x: width, y: height };

    {
      const cloud1Canvas = await renderBackgroundImage({
        src: '/data/weather_gfx/parallax_clounds_01.png',
        color: theme.cloud1,
        colorRenderMode: 'clouds',
        size: size,
        offsetY: -100,
      });

      ctx.globalAlpha = 0.5;
      ctx.drawImage(cloud1Canvas, 0, 0);
      ctx.globalAlpha = 1;
    }

    {
      const mountain2Canvas = await renderBackgroundImage({
        src: '/data/weather_gfx/parallax_mountains_02.png',
        color: theme.mountain2,
        colorRenderMode: 'mountain',
        size: size,
      });

      ctx.drawImage(mountain2Canvas, 0, 0);
    }

    {
      const cloud2Canvas = await renderBackgroundImage({
        src: '/data/weather_gfx/parallax_clounds_02.png',
        color: theme.cloud2,
        colorRenderMode: 'clouds',
        offsetY: 150,
        size: size,
      });

      ctx.drawImage(cloud2Canvas, 0, 0);
    }

    {
      const mountain1BackCanvas = await renderBackgroundImage({
        src: '/data/weather_gfx/parallax_mountains_layer_02.png',
        color: theme.mountain1Back,
        colorRenderMode: 'mountain',
        offsetY: 200,
        size: size,
      });

      ctx.drawImage(mountain1BackCanvas, 0, 0);
    }

    {
      const mountain1HighlightCanvas = await renderBackgroundImage({
        src: '/data/weather_gfx/parallax_mountains_layer_01.png',
        color: theme.mountain1Highlight,
        colorRenderMode: 'mountain',
        offsetY: 200,
        size: size,
      });

      ctx.drawImage(mountain1HighlightCanvas, 0, 0);
    }
  } else {
    ctx.fillStyle = theme.background;
    ctx.fillRect(coords.x, coords.y, width, height);

    if (theme.hasStars) {
      await renderBackgroundStars({ ctx, starSizeMultiplier });
    }
  }
}
