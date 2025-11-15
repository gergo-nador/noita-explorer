import { FileSystemFileAccess } from '@noita-explorer/model';
import { convertDataWakFileToImageData } from './convert-data-wak-file-to-image-data.ts';
import { DataWakMediaIndex } from '@noita-explorer/model-noita';

interface Props {
  file: FileSystemFileAccess;
  ctx: OffscreenCanvasRenderingContext2D;
  mediaIndex: DataWakMediaIndex;
}

export async function convertEntityMediaToImageData({
  file,
  ctx,
  mediaIndex,
}: Props) {
  if (mediaIndex.type === 'png' || mediaIndex.type === 'xml-png') {
    return convertDataWakFileToImageData({ file, ctx });
  }

  if (mediaIndex.type === 'xml-gif' && mediaIndex.xmlGifFirstFrame) {
    return convertDataWakFileToImageData({
      file,
      ctx,
      cut: {
        size: mediaIndex.xmlGifFirstFrame.size,
        position: mediaIndex.xmlGifFirstFrame.position,
      },
    });
  }

  throw new Error(`Invalid media index: ${JSON.stringify(mediaIndex)}`);
}
