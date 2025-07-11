import { SpriteAnimation } from '../common/noita-sprite-animation.ts';

export interface NoitaScrapedGif {
  animationId: string;
  sprite: SpriteAnimation;
  buffer: string;
  repeat: boolean;
  firstFrame: string;
}
