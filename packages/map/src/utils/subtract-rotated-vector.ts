import { Vector2d } from '@noita-explorer/model';

/**
 * Subtracts a 2D vector (v1) from another 2D vector (v2) that has been
 * rotated by a specified number of radians.
 *
 * @param v1 - The first vector (not rotated).
 * @param v2 - The second vector (to be rotated before addition).
 * @param radians - The rotation angle in radians.
 * @returns A new Vector2D representing the sum of v1 and rotated v2.
 */
export function subtractRotatedVector(
  v1: Vector2d,
  v2: Vector2d,
  radians: number,
): Vector2d {
  const cosTheta = Math.cos(radians);
  const sinTheta = Math.sin(radians);

  const rotatedV2_x = v2.x * cosTheta - v2.y * sinTheta;
  const rotatedV2_y = v2.x * sinTheta + v2.y * cosTheta;

  const resultX = v1.x - rotatedV2_x;
  const resultY = v1.y - rotatedV2_y;

  return { x: resultX, y: resultY };
}
