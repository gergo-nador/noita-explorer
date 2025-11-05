import {
  RgbaColor,
  StringKeyDictionary,
  ValueRef,
  Vector2d,
} from '@noita-explorer/model';
import { NoitaMaterial, ChunkFileFormat } from '@noita-explorer/model-noita';
import { renderPixelatedImage } from '../utils/render-pixelated-image.ts';
import { renderChunkPixel } from './render-chunk-pixel.ts';
import { PixelCalculator } from '../interfaces/pixel-calculator.ts';
import { renderChunkEntities } from './render-chunk-entities.ts';
import { ChunkRenderableEntity } from './chunk-renderable-entity.ts';

interface Props {
  chunk: ChunkFileFormat;
  chunkCoordinates: Vector2d;
  materials: StringKeyDictionary<NoitaMaterial>;
  materialImageCache: StringKeyDictionary<ImageData>;
  materialColorCache: StringKeyDictionary<RgbaColor>;
  entities: ChunkRenderableEntity[];
}

export function renderChunk({
  chunk,
  chunkCoordinates,
  materials,
  materialImageCache,
  materialColorCache,
  entities,
}: Props) {
  const canvas = document.createElement('canvas');
  canvas.width = chunk.width;
  canvas.height = chunk.height;
  canvas.style.imageRendering = 'pixelated';

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) {
    console.error('2D context not available!');
    return;
  }
  ctx.imageSmoothingEnabled = false;

  const customColorIndexRef: ValueRef<number> = { value: 0 };

  const pixelCalculator: PixelCalculator = (x, y) =>
    // @ts-expect-error not used anymore
    renderChunkPixel({
      x,
      y,
      chunk,
      customColorIndexRef,
      materials,
      materialImageCache,
      materialColorCache,
    });

  const imageData = ctx.createImageData(chunk.width, chunk.height);
  // first render the background entities
  renderChunkEntities({
    entities,
    chunkCoordinates,
    chunkImageData: imageData,
  });
  // render terrain on top
  renderPixelatedImage({
    imageData,
    width: chunk.width,
    height: chunk.height,
    calculatePixel: pixelCalculator,
  });

  ctx.putImageData(imageData, 0, 0);

  return { canvas };
}
