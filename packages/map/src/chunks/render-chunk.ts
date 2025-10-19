import {
  RgbaColor,
  StringKeyDictionary,
  ValueRef,
} from '@noita-explorer/model';
import { NoitaMaterial } from '@noita-explorer/model-noita';
import { ChunkRawFormat } from '../interfaces/chunk-raw-format.ts';
import { renderPixelatedImage } from '../utils/render-pixelated-image.ts';
import { renderChunkPixel } from './render-chunk-pixel.ts';
import { PixelCalculator } from '../interfaces/pixel-calculator.ts';

interface Props {
  chunk: ChunkRawFormat;
  materials: StringKeyDictionary<NoitaMaterial>;
  materialImageCache: StringKeyDictionary<CanvasRenderingContext2D>;
  materialColorCache: StringKeyDictionary<RgbaColor>;
}

export function renderChunk({
  chunk,
  materials,
  materialImageCache,
  materialColorCache,
}: Props) {
  const canvas = document.createElement('canvas');
  canvas.width = chunk.width;
  canvas.height = chunk.height;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) {
    console.error('2D context not available!');
    return;
  }

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

  return { canvas };
}
