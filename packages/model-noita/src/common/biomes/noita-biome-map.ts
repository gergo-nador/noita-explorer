import { Vector2d } from '@noita-explorer/model';

export interface NoitaBiomeMap {
  biomeIndices: number[][];
  biomeOffset: Vector2d;
  biomeSize: Vector2d;
}
