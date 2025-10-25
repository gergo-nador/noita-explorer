import { WorldPixelScene } from './world-pixel-scene.ts';
import { WorldPixelSceneBackgroundImage } from './world-pixel-scene-background-image.ts';

export interface WorldPixelSceneFileFormat {
  pendingPixelScenes: WorldPixelScene[];
  placedPixelScenes: WorldPixelScene[];
  backgroundImages: WorldPixelSceneBackgroundImage[];
}
