import {
  FileSystemFileAccess,
  ImagePngDimension,
  Vector2d,
} from '@noita-explorer/model';

interface Props {
  file: FileSystemFileAccess;
  ctx: OffscreenCanvasRenderingContext2D;
  cut?: {
    size: ImagePngDimension;
    position: Vector2d;
  };
}

export async function convertDataWakFileToImageData({ file, ctx, cut }: Props) {
  const fileBuffer = await file.read.asBuffer();
  const arrayBuffer = fileBuffer.buffer as ArrayBuffer;

  const blob = new Blob([arrayBuffer], { type: 'image/png' });
  const imageBitmap = await createImageBitmap(blob);

  const offscreenCanvas = ctx.canvas;

  offscreenCanvas.width = cut?.size?.width ?? imageBitmap.width;
  offscreenCanvas.height = cut?.size?.height ?? imageBitmap.height;

  ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

  ctx.drawImage(
    imageBitmap,
    cut?.position?.x ?? 0,
    cut?.position?.y ?? 0,
    cut?.size?.width ?? imageBitmap.width,
    cut?.size?.height ?? imageBitmap.height,
    0,
    0,
    offscreenCanvas.width,
    offscreenCanvas.height,
  );

  const imageData = ctx.getImageData(
    0,
    0,
    offscreenCanvas.width,
    offscreenCanvas.height,
  );

  imageBitmap.close();

  return imageData;
}
