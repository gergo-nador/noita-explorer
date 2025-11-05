import { Vector2d } from '@noita-explorer/model';

export interface NoitaBiome {
  group: string;
  bgImagePath?: string;
  bgImageEdgeLeft?: string;
  bgImageEdgeRight?: string;
  bgImageEdgeTop?: string;
  bgImageEdgeBottom?: string;
  bgImageEdgePriority?: number;
  limitBackgroundImage: boolean;
  backgroundImageHeight?: number;
  staticTile?: {
    bgMask: string;
    position: Vector2d;
    size: Vector2d;
  };
}
