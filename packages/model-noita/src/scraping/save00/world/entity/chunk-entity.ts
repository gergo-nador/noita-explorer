import { Vector2d } from '@noita-explorer/model';
import { ChunkEntityComponent } from './chunk-entity-component.ts';

export interface ChunkEntity {
  name: string;
  tags: string;
  lifetimePhase: number; // byte
  fileName: string;
  position: Vector2d;
  rotation: number; // float
  scale: Vector2d;

  components: ChunkEntityComponent[];
  childrenCount: number;
  children: ChunkEntity[];
}
