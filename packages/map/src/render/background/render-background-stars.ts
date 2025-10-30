import { backgroundStars } from './background-stars.ts';
import { randomHelpers } from '@noita-explorer/tools';
import { fetchImageBitmap } from '../../utils/fetch-image-bitmap.ts';

interface Props {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  starSizeMultiplier: number;
}

export async function renderBackgroundStars({
  ctx,
  starSizeMultiplier,
}: Props) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  const stars = backgroundStars;

  for (const star of stars) {
    // amount, that supports values decimal values as well
    const amount =
      randomHelpers.randomInt(
        star.minCountPerTile * 10,
        star.maxCountPerTile * 10,
      ) / 10;

    if (amount === 0) continue;

    const { img, close } = await fetchImageBitmap(star.src);

    for (let i = 0; i < amount; i++) {
      const x = randomHelpers.randomInt(0, width);
      const y = randomHelpers.randomInt(0, height);

      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        x,
        y,
        img.width * starSizeMultiplier,
        img.height * starSizeMultiplier,
      );
    }

    close();
  }
}
