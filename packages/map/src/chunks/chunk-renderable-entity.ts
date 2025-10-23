import { Vector2d } from '@noita-explorer/model';

export interface ChunkRenderableEntity {
  name: string;
  tags: string;
  lifetimePhase: number; // byte
  sprites: ChunkRenderableEntitySprite[];
}

export interface ChunkRenderableEntitySprite {
  position: Vector2d;
  scale: Vector2d;
  rotation: number; // float
  imageData: ImageData;
  isBackgroundComponent: boolean;
  isAdditive: boolean;
}
