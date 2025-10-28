import { NoitaBiome, StreamInfoBackground } from '@noita-explorer/model-noita';
import { mapConstants } from '../../map-constants.ts';
import { ChunkBorders } from '../../interfaces/chunk-borders.ts';
import { fetchImageBitmap } from '../../utils/fetch-image-bitmap.ts';

interface Props {
  backgroundItems: StreamInfoBackground[];
  biome: NoitaBiome;
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  chunkBorders: ChunkBorders;
}

export async function renderBiomeTile({
  ctx,
  biome,
  backgroundItems,
  chunkBorders,
}: Props) {
  const CAVE_LIMIT_Y = 225;
  try {
    const bgImagePath = biome.bgImagePath;

    if (bgImagePath) {
      const { img, close } = await fetchImageBitmap(bgImagePath);

      for (let i = 0; i < mapConstants.chunkWidth; i += img.width) {
        for (let j = 0; j < mapConstants.chunkHeight; j += img.height) {
          // if there is no limitation or the limitation not applies for this chunk
          if (!biome.limitBackgroundImage || chunkBorders.topY > CAVE_LIMIT_Y) {
            ctx.drawImage(img, i, j);
            continue;
          }

          // skip rendering if we are way past the limit
          const bgLimit = biome.backgroundImageHeight ?? CAVE_LIMIT_Y;
          if (biome.limitBackgroundImage && chunkBorders.bottomY < bgLimit)
            continue;

          // bg limit in the current chunk
          const currentImageTop = j;
          const currentImageBottom = j + img.height;

          // if the current image is above limit, skip
          if (chunkBorders.topY + currentImageBottom < bgLimit) continue;
          // if the current image is below limit, render
          if (chunkBorders.topY + currentImageTop > bgLimit) {
            ctx.drawImage(img, i, j);
            continue;
          }

          // bg limit in the current chunk
          const sy = bgLimit - j;
          const height = img.height - sy;
          ctx.drawImage(
            img,
            0,
            sy,
            img.width,
            height,
            i,
            j + sy,
            img.width,
            height,
          );
        }
      }

      close();
    }
  } catch (error) {
    console.error('Error loading bg image:', error);
    throw error;
  }

  for (const background of backgroundItems) {
    const { img, close } = await fetchImageBitmap(background.fileName);

    // source X
    const bgAbsLeftX = background.position.x;
    const bgAbsRightX = background.position.x + img.width;

    const sourceAbsLeftX = Math.max(chunkBorders.leftX, bgAbsLeftX);
    const sourceAbsRightX = Math.min(chunkBorders.rightX, bgAbsRightX);

    const sourceX = sourceAbsLeftX - bgAbsLeftX;
    const sourceWidth = sourceAbsRightX - sourceAbsLeftX;

    // source Y
    const bgAbsTopY = background.position.y;
    const bgAbsBottomY = background.position.y + img.height;

    const sourceAbsTopY = Math.max(chunkBorders.topY, bgAbsTopY);
    const sourceAbsBottomY = Math.min(chunkBorders.bottomY, bgAbsBottomY);

    const sourceY = sourceAbsTopY - bgAbsTopY;
    const sourceHeight = sourceAbsBottomY - sourceAbsTopY;

    // destination
    const destX = sourceAbsLeftX - chunkBorders.leftX;
    const destY = sourceAbsTopY - chunkBorders.topY;
    const destWidth = sourceWidth;
    const destHeight = sourceHeight;

    // additional checks to see if we didn't do something wrong
    if (
      // source image checks
      sourceX > img.width ||
      sourceY > img.height ||
      sourceWidth > img.width ||
      sourceHeight > img.height ||
      // dest image checks
      destX > mapConstants.chunkWidth ||
      destY > mapConstants.chunkHeight ||
      destWidth > mapConstants.chunkWidth ||
      destHeight > mapConstants.chunkHeight
    ) {
      return;
    }

    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      destX,
      destY,
      destWidth,
      destHeight,
    );

    close();
  }
}
