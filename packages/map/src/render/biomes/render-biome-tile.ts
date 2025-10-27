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
    const shouldSkip = !bgImagePath || !biome.loadBgImage;

    if (!shouldSkip) {
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

    const sourceX = Math.max(chunkBorders.leftX - background.position.x, 0);
    const sourceY = Math.max(chunkBorders.topY - background.position.y, 0);
    const sourceWidth = Math.min(
      chunkBorders.rightX - background.position.x,
      img.width,
    );
    const sourceHeight = Math.min(
      chunkBorders.bottomY - background.position.y,
      img.height,
    );

    const destX = Math.max(background.position.x - chunkBorders.leftX, 0);
    const destY = Math.max(background.position.y - chunkBorders.topY, 0);
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
