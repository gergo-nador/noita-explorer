import { SpriteAnimation } from '@noita-explorer/model-noita';
import { FileSystemFileAccess } from '@noita-explorer/model';

export interface AnimationFramesResult {
  animation: SpriteAnimation;
  frameImages: string[];
}

export interface AnimationInfo {
  id: string;
  file: FileSystemFileAccess;
  layers?: AnimationInfo[];
  imageManipulation?: {
    /**
     * Assign a new color for an existing color. Underscore will be used as the default color if present.
     */
    reColor: Record<string | '_', string>;
  };
}
