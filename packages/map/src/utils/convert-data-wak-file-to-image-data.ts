import { FileSystemFileAccess } from '@noita-explorer/model';

interface Props {
  file: FileSystemFileAccess;
  ctx: OffscreenCanvasRenderingContext2D;
}

export async function convertDataWakFileToImageData({ file, ctx }: Props) {
  const fileBuffer = await file.read.asBuffer();
  const arrayBuffer = fileBuffer.buffer as ArrayBuffer;

  const blob = new Blob([arrayBuffer], { type: 'image/png' });
  const imageBitmap = await createImageBitmap(blob);

  const offscreenCanvas = ctx.canvas;

  offscreenCanvas.width = imageBitmap.width;
  offscreenCanvas.height = imageBitmap.height;

  ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

  ctx.drawImage(imageBitmap, 0, 0);

  const imageData = ctx.getImageData(
    0,
    0,
    offscreenCanvas.width,
    offscreenCanvas.height,
  );

  imageBitmap.close();

  return imageData;
}
