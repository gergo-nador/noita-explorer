import { backgroundStars } from './background-stars.ts';
import { randomHelpers } from '@noita-explorer/tools';
import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { getDataWakImage } from '../../utils/get-data-wak-image.ts';

interface Props {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  starSizeMultiplier: number;
  dataWakDirectory: FileSystemDirectoryAccess;
}

export async function renderBackgroundStars({
  ctx,
  starSizeMultiplier,
  dataWakDirectory,
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

    const img = await getDataWakImage({ path: star.src, dataWakDirectory });

    for (let i = 0; i < amount; i++) {
      const imgWidth = img.width * starSizeMultiplier;
      const imgHeight = img.height * starSizeMultiplier;

      const x = randomHelpers.randomInt(0, width - imgWidth);
      const y = randomHelpers.randomInt(0, height - imgHeight);

      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        x,
        y,
        imgWidth,
        imgHeight,
      );
    }

    img.close();
  }
}
