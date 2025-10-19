import { PixelCalculator } from '../interfaces/pixel-calculator.ts';

/**
 * Renders an image on the canvas pixel by pixel using a calculator function.
 * @param ctx The 2D rendering context of the canvas.
 * @param width The width of the area to render.
 * @param height The height of the area to render.
 * @param calculatePixel Your function that defines the color of each pixel.
 */
export function renderPixelatedImage(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  calculatePixel: PixelCalculator,
) {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = calculatePixel(x, y, width, height);

      const index = (y * width + x) * 4;

      data[index] = color.r;
      data[index + 1] = color.g;
      data[index + 2] = color.b;
      data[index + 3] = color.a;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
