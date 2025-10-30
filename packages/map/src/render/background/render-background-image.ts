import { CSSProperties } from 'react';
import { Vector2d } from '@noita-explorer/model';
import { fetchImageBitmap } from '../../utils/fetch-image-bitmap.ts';

interface Props {
  src: string;
  color: NonNullable<CSSProperties['color']>;
  colorRenderMode: 'clouds' | 'mountain';
  offsetY?: number;
  size: Vector2d;
}

export async function renderBackgroundImage({
  src,
  color,
  colorRenderMode,
  offsetY,
  size,
}: Props) {
  offsetY ??= 0;
  const width = size.x;
  const height = size.y;

  const canvas = new OffscreenCanvas(width, height);

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('CanvasRenderingContext2D is not supported');
  }

  ctx.imageSmoothingEnabled = false;

  // 1. fill the whole canvas with the color the image should have
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const { img, close } = await fetchImageBitmap(src);
  if (colorRenderMode === 'clouds') {
    // 2. mix the img and the chosen color
    ctx.globalCompositeOperation = 'lighter';
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
  }

  // 3. mask the canvas
  ctx.globalCompositeOperation = 'destination-in';
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

  close();

  return canvas;
}
