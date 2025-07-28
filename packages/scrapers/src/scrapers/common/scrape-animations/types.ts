import { SpriteAnimation } from '@noita-explorer/model-noita';
import { FileSystemFileAccess, Vector2d } from '@noita-explorer/model';
import { OverlayOptions } from '@noita-explorer/tools';

export interface AnimationFramesResult {
  animation: SpriteAnimation;
  frameImages: string[];
}

export interface AnimationInfo {
  id: string;
  file: FileSystemFileAccess;
  layers?: AnimationInfoLayer[];
  imageManipulation?: {
    /**
     * Assign a new color for an existing color. Underscore will be used as the default color if present.
     */
    reColor?: Record<string | '_', string>;
    scale?: Vector2d;
  };
}

export interface AnimationInfoLayer extends AnimationInfo {
  useSameSprite?: boolean;
  overlayOptions?: OverlayOptions;
}
