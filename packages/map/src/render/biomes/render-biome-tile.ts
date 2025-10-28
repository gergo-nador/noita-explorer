import {
  NoitaWakBiomes,
  StreamInfoBackground,
} from '@noita-explorer/model-noita';
import { mapConstants } from '../../map-constants.ts';
import { ChunkBorders } from '../../interfaces/chunk-borders.ts';
import { fetchImageBitmap } from '../../utils/fetch-image-bitmap.ts';
import { Vector2d } from '@noita-explorer/model';
import { createNoitaWakBiomesHelper } from './noita-wak-biomes-helper.ts';

interface Props {
  backgroundItems: StreamInfoBackground[];
  biomeCoords: Vector2d;
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  chunkBorders: ChunkBorders;
  biomes: NoitaWakBiomes;
}

export async function renderBiomeTile({
  ctx,
  biomeCoords,
  backgroundItems,
  chunkBorders,
  biomes,
}: Props) {
  const biomeHelpers = createNoitaWakBiomesHelper({ biomes });
  const biome = biomeHelpers.getBiome(biomeCoords);

  const CAVE_LIMIT_Y = 225;
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

  // mask
  if (bgImagePath && biome.staticTile) {
    const originalImageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height,
    );

    const staticTile = biome.staticTile;

    const { img: bgMask, close } = await fetchImageBitmap(staticTile.bgMask);

    const relX = biomeCoords.x - staticTile.position.x;
    const relY = biomeCoords.y - staticTile.position.y;

    const maskBgWidth = bgMask.width;
    const maskBgHeight = bgMask.height;

    const sx = (relX / staticTile.size.x) * maskBgWidth;
    const sy = (relY / staticTile.size.y) * maskBgHeight;
    const sw = maskBgWidth / staticTile.size.x;
    const sh = maskBgHeight / staticTile.size.y;

    ctx.imageSmoothingQuality = 'low';

    ctx.drawImage(
      bgMask,
      sx,
      sy,
      sw,
      sh,
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height,
    );

    const maskImageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height,
    );

    for (let i = 0; i < originalImageData.data.length; i += 4) {
      // greyscale img
      const maskMultiplier = maskImageData.data[i] > 125 ? 1 : 0;

      originalImageData.data[i] = originalImageData.data[i] * maskMultiplier;
      originalImageData.data[i + 1] =
        originalImageData.data[i + 1] * maskMultiplier;
      originalImageData.data[i + 2] =
        originalImageData.data[i + 2] * maskMultiplier;
      originalImageData.data[i + 3] =
        originalImageData.data[i + 3] * maskMultiplier;
    }

    ctx.putImageData(originalImageData, 0, 0);

    close();
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
