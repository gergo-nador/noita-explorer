import { Vector2d } from '@noita-explorer/model';

export interface NoitaScrapedSprite {
  tags: string[];
  imageFile: string;
  alpha: number | undefined;
  offsetX: number | undefined;
  offsetY: number | undefined;
  additive: boolean | undefined;
  emissive: boolean | undefined;
  zIndex: number | undefined;
  transform?: {
    scale?: Vector2d;
  };
}

export interface NoitaScrapedPhysicsImageShapeComponent {
  imageFile: string;
  material?: string;
  offsetX?: number;
  offsetY?: number;
}
