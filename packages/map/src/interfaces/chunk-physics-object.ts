import { Vector2d } from '@noita-explorer/model';

export interface ChunkPhysicsObject {
  position: Vector2d;
  rotation: number; // float
  width: number; // uint
  height: number; // uint
  pixelData: number[]; // rgba
}
