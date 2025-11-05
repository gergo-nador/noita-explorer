import { Vector2d } from '@noita-explorer/model';
import { ChunkBorders, mapConstants } from '../main.ts';

interface Props {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  position: Vector2d;
  image: ImageBitmap;
  chunkBorders: ChunkBorders;
}

export function renderObjectOntoTile({
  ctx,
  position,
  image,
  chunkBorders,
}: Props) {
  // source X
  const bgAbsLeftX = position.x;
  const bgAbsRightX = position.x + image.width;

  const sourceAbsLeftX = Math.max(chunkBorders.leftX, bgAbsLeftX);
  const sourceAbsRightX = Math.min(chunkBorders.rightX, bgAbsRightX);

  const sourceX = sourceAbsLeftX - bgAbsLeftX;
  const sourceWidth = sourceAbsRightX - sourceAbsLeftX;

  // source Y
  const bgAbsTopY = position.y;
  const bgAbsBottomY = position.y + image.height;

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
    sourceX > image.width ||
    sourceY > image.height ||
    sourceWidth > image.width ||
    sourceHeight > image.height ||
    // dest image checks
    destX > mapConstants.chunkWidth ||
    destY > mapConstants.chunkHeight ||
    destWidth > mapConstants.chunkWidth ||
    destHeight > mapConstants.chunkHeight
  ) {
    return;
  }

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    destX,
    destY,
    destWidth,
    destHeight,
  );
}
