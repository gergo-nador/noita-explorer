import { Vector2d } from '@noita-explorer/model';
import { WorldPixelSceneColorMaterial } from './world-pixel-scene-color-material.ts';

export interface WorldPixelScene {
  position: Vector2d;
  materialFileName: string;
  colorFileName: string;
  backgroundFileName: string;
  skipBiomeChecks: boolean;
  skipEdgeTextures: boolean;
  backgroundZIndex: number;
  loadEntity: string;
  cleanAreaBefore: boolean;

  colorMaterial: WorldPixelSceneColorMaterial[];
}
