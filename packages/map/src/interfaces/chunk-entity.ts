import { Vector2d } from '@noita-explorer/model';

export interface ChunkEntity {
  name: string;
  tags: string;
  lifetimePhase: number; // byte
  fileName: string;
  position: Vector2d;
  rotation: number; // float
  scale: Vector2d;
}
