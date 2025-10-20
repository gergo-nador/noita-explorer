import {
  RgbaColor,
  StringKeyDictionary,
  ValueRef,
  Vector2d,
} from '@noita-explorer/model';
import { NoitaMaterial } from '@noita-explorer/model-noita';
import { ChunkRawFormat } from '../interfaces/chunk-raw-format.ts';
import { renderPixelatedImage } from '../utils/render-pixelated-image.ts';
import { renderChunkPixel } from './render-chunk-pixel.ts';
import { PixelCalculator } from '../interfaces/pixel-calculator.ts';
import { renderPhysicsObjects } from './render-physics-objects.ts';

interface Props {
  chunk: ChunkRawFormat;
  chunkCoordinates: Vector2d;
  materials: StringKeyDictionary<NoitaMaterial>;
  materialImageCache: StringKeyDictionary<CanvasRenderingContext2D>;
  materialColorCache: StringKeyDictionary<RgbaColor>;
}

export function renderChunk({
  chunk,
  chunkCoordinates,
  materials,
  materialImageCache,
  materialColorCache,
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
    renderChunkPixel({
      x,
      y,
      chunk,
      customColorIndexRef,
      materials,
      materialImageCache,
      materialColorCache,
    });

  renderPixelatedImage(ctx, chunk.width, chunk.height, pixelCalculator);
  renderPhysicsObjects({
    physicsObjects: chunk.physicsObjects,
    chunkCoordinates: chunkCoordinates,
    chunk: chunk,
    ctx: ctx,
  });

  return { canvas };
}
