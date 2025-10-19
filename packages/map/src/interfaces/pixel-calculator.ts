import { RgbaColor } from '@noita-explorer/model';

/**
 * This function is called for every single pixel on the canvas.
 * @param x - The horizontal coordinate of the pixel.
 * @param y - The vertical coordinate of the pixel.
 * @param width - The total width of the canvas.
 * @param height - The total height of the canvas.
 * @returns A Color object for the pixel at (x, y).
 */
export type PixelCalculator = (
  x: number,
  y: number,
  width: number,
  height: number,
) => RgbaColor;
