import { SpriteAnimation } from '@noita-explorer/model-noita';

export interface AnimationFramesResult {
  animation: SpriteAnimation;
  frameImages: string[];
}

export interface AnimationInfo {
  id: string;
  layers?: AnimationInfo[];
  imageManipulation?: {
    /**
     * Assign a new color for an existing color. Underscore will be used as the default color if present.
     */
    reColor: Record<string | '_', string>;
  };
}
