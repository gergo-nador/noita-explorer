import { FileSystemFileAccess } from '@noita-explorer/model';
import { convertDataWakFileToImageData } from './convert-data-wak-file-to-image-data.ts';

interface Props {
  file: FileSystemFileAccess;
  ctx: OffscreenCanvasRenderingContext2D;
}

export async function convertEntityMediaToImageData({ file, ctx }: Props) {
  const isPng = file.getName().endsWith('.png');
  if (isPng) {
    return convertDataWakFileToImageData({ file, ctx });
  }

  const isXml = file.getName().endsWith('.xml');
  if (isXml) {
    // todo finish this
  }

  throw new Error('invalid entity media file extension: ' + file.getName());
}
