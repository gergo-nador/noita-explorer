import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
  Vector2d,
} from '@noita-explorer/model';
import { ChunkRenderableEntitySprite } from '../../interfaces/chunk-renderable-entity.ts';
import { ChunkRenderable } from '../../interfaces/chunk-renderable.ts';
import { renderTileRenderable } from '../../utils/render-tile-renderable.ts';
import { convertEntityMediaToImageData } from '../../utils/convert-entity-media-to-image-data.ts';
import { DataWakMediaIndex } from '@noita-explorer/model-noita';

interface Props {
  imageData: ImageData;
  chunkCoordinates: Vector2d;
  entities: ChunkRenderableEntitySprite[];
  dataWakDirectory: FileSystemDirectoryAccess;
  mediaIndex: StringKeyDictionary<DataWakMediaIndex>;
}

export async function renderEntities({
  imageData,
  chunkCoordinates,
  entities,
  dataWakDirectory,
  mediaIndex,
}: Props) {
  const canvas = new OffscreenCanvas(10, 10);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('CanvasRenderingContext is not supported');
  }

  for (const entity of entities) {
    const media = mediaIndex[entity.mediaPath];
    if (!media) continue;

    const file = await dataWakDirectory.getFile(media.pngPath);
    const img = await convertEntityMediaToImageData({
      file,
      ctx,
      mediaIndex: media,
    });

    const chunkRenderable: ChunkRenderable = {
      position: entity.position,
      rotation: entity.rotation,
      scale: entity.scale,
      width: entity.size.x,
      height: entity.size.y,
      getPixel: (coords: Vector2d) => {
        const colorIndex = (img.width * coords.y + coords.x) * 4;

        const r = img.data[colorIndex];
        const g = img.data[colorIndex + 1];
        const b = img.data[colorIndex + 2];
        const a = img.data[colorIndex + 3];

        const color = (r << 24) | (g << 16) | (b << 8) | a;
        return color >>> 0;
      },
    };

    renderTileRenderable({
      chunkCoordinates,
      chunkImageData: imageData,
      chunkRenderable,
    });
  }
}
