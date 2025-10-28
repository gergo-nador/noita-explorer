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
  try {
    const bgImagePath = biome.bgImagePath;

    if (bgImagePath && Math.random() > 1) {
      const { img, close } = await fetchImageBitmap(bgImagePath);

      for (let i = 0; i < mapConstants.chunkWidth; i += img.width) {
        for (let j = 0; j < mapConstants.chunkHeight; j += img.height) {
          ctx.drawImage(img, i, j);
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
      debugger;
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
