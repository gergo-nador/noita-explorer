import { FileSystemDirectoryAccess, Vector2d } from '@noita-explorer/model';
import { ChunkRenderableEntitySprite } from '../../interfaces/chunk-renderable-entity.ts';
import { ChunkRenderable } from '../../interfaces/chunk-renderable.ts';
import { renderTileRenderable } from '../../utils/render-tile-renderable.ts';
import { convertEntityMediaToImageData } from '../../utils/convert-entity-media-to-image-data.ts';
import { colorHelpers } from '@noita-explorer/tools';

interface Props {
  imageData: ImageData;
  chunkCoordinates: Vector2d;
  entities: ChunkRenderableEntitySprite[];
  dataWakDirectory: FileSystemDirectoryAccess;
}

export async function renderEntities({
  imageData,
  chunkCoordinates,
  entities,
  dataWakDirectory,
}: Props) {
  const canvas = new OffscreenCanvas(1, 1);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('CanvasRenderingContext is not supported');
  }

  for (const entity of entities) {
    const file = await dataWakDirectory.getFile(entity.mediaPath);
    const img = await convertEntityMediaToImageData({
      file,
      ctx,
    });

    const chunkRenderable: ChunkRenderable = {
      position: entity.position,
      rotation: entity.rotation,
      scale: entity.scale,
      width: entity.size.x,
      height: entity.size.y,
      getPixel: (coords: Vector2d) => {
        const colorIndex = img.width * coords.y + coords.x;
        const color = img.data[colorIndex];
        return colorHelpers.conversion.fromAbgrNumber(color).toRgbaNum();
      },
    };

    renderTileRenderable({
      chunkCoordinates,
      chunkImageData: imageData,
      chunkRenderable,
    });
  }
}
