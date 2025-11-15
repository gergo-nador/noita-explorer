import { ImagePngDimension, Vector2d } from '@noita-explorer/model';

export type DataWakMediaIndexType = 'png' | 'xml-png' | 'xml-gif';

export interface DataWakMediaIndex {
  size: ImagePngDimension;
  type: DataWakMediaIndexType;
  xmlGifFirstFrame?: { position: Vector2d; size: ImagePngDimension };
  offset?: Vector2d;
  pngPath: string;
}
