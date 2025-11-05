import { CSSProperties } from 'react';
import { FileSystemDirectoryAccess, Vector2d } from '@noita-explorer/model';
import { getDataWakImage } from '../../utils/get-data-wak-image.ts';

interface Props {
  src: string;
  color: NonNullable<CSSProperties['color']>;
  colorRenderMode: 'clouds' | 'mountain';
  offsetY?: number;
  size: Vector2d;
  dataWakDirectory: FileSystemDirectoryAccess;
  canvas: OffscreenCanvas;
  ctx: OffscreenCanvasRenderingContext2D;
}

export async function renderBackgroundImage({
  src,
  color,
  colorRenderMode,
  offsetY,
  size,
  dataWakDirectory,
  canvas,
  ctx,
}: Props) {
  offsetY ??= 0;
  const width = size.x;
  const height = size.y;

  canvas.width = width;
  canvas.height = height;
  ctx.imageSmoothingQuality = 'low';
  ctx.imageSmoothingEnabled = false;

  // 1. fill the whole canvas with the color the image should have
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const img = await getDataWakImage({ path: src, dataWakDirectory });
  if (colorRenderMode === 'clouds') {
    // 2. mix the img and the chosen color
    ctx.globalCompositeOperation = 'lighter';
    if (offsetY >= 0) {
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height - offsetY,
        0,
        offsetY,
        width,
        height - offsetY,
      );
    } else {
      ctx.drawImage(
        img,
        0,
        -offsetY,
        img.width,
        img.height + offsetY,
        0,
        0,
        width,
        height + offsetY,
      );
    }
  }

  // 3. mask the canvas
  ctx.globalCompositeOperation = 'destination-in';
  if (offsetY >= 0) {
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height - offsetY,
      0,
      offsetY,
      width,
      height - offsetY,
    );
  } else {
    ctx.drawImage(
      img,
      0,
      -offsetY,
      img.width,
      img.height + offsetY,
      0,
      0,
      width,
      height + offsetY,
    );
  }

  // 4. reset globalCompositeOperation
  ctx.globalCompositeOperation = 'source-over';

  img.close();

  return canvas;
}
