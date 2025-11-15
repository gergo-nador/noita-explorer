import {
  NoitaWakBiomes,
  StreamInfoBackground,
} from '@noita-explorer/model-noita';
import { CAVE_LIMIT_Y, mapConstants } from '../../map-constants.ts';
import { FileSystemDirectoryAccess, Vector2d } from '@noita-explorer/model';
import { createNoitaWakBiomesHelper } from './noita-wak-biomes-helper.ts';
import { renderObjectOntoTile } from '../../utils/render-object-onto-tile.ts';
import { getDataWakImage } from '../../utils/get-data-wak-image.ts';

interface Props {
  backgroundItems: StreamInfoBackground[];
  biomeCoords: Vector2d;
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  biomes: NoitaWakBiomes;
  dataWakDirectory: FileSystemDirectoryAccess;
}

export async function renderBiomeTile({
  ctx,
  biomeCoords,
  backgroundItems,
  biomes,
  dataWakDirectory,
}: Props) {
  const biomeHelpers = createNoitaWakBiomesHelper({ biomes });
  const biome = biomeHelpers.getBiome(biomeCoords);

  const bgImagePath = biome.bgImagePath;

  const chunkBorders = {
    leftX: biomeCoords.x * mapConstants.chunkWidth,
    rightX: (biomeCoords.x + 1) * mapConstants.chunkWidth,
    topY: biomeCoords.y * mapConstants.chunkHeight,
    bottomY: (biomeCoords.y + 1) * mapConstants.chunkHeight,
  };

  if (bgImagePath) {
    const img = await getDataWakImage({
      dataWakDirectory,
      path: bgImagePath,
    });

    for (let i = 0; i < mapConstants.chunkWidth; i += img.width) {
      for (let j = 0; j < mapConstants.chunkHeight; j += img.height) {
        // if there is no limitation or the limitation not applies for this chunk
        if (!biome.limitBackgroundImage || chunkBorders.topY > CAVE_LIMIT_Y) {
          ctx.drawImage(img, i, j);
          continue;
        }

        const chunkRelativeCaveLimit =
          mapConstants.chunkHeight -
          Math.abs(CAVE_LIMIT_Y % mapConstants.chunkHeight);

        // skip rendering if we are way past the limit
        const bgLimit = biome.backgroundImageHeight ?? chunkRelativeCaveLimit;
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

    img.close();
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

    const bgMask = await getDataWakImage({
      dataWakDirectory,
      path: staticTile.bgMask,
    });

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

    bgMask.close();
  }

  for (const background of backgroundItems) {
    const img = await getDataWakImage({
      path: background.fileName,
      dataWakDirectory,
    });

    renderObjectOntoTile({
      ctx,
      position: background.position,
      image: img,
      chunkBorders,
    });

    img.close();
  }
}
