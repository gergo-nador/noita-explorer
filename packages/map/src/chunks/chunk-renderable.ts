import { Vector2d, RgbaColor } from '@noita-explorer/model';

export interface ChunkRenderable {
  position: Vector2d;
  scale: Vector2d;
  rotation: number;
  width: number;
  height: number;
  getPixel: (coords: Vector2d) => RgbaColor;
}
