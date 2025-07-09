import { SpriteAnimation } from '../common/noita-sprite-animation.ts';

export interface NoitaGif {
  animationId: string;
  sprite: SpriteAnimation;
  buffer: string;
  repeat: boolean;
  firstFrame: string;
}
