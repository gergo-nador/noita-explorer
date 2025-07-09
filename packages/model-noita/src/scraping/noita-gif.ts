import { SpriteAnimation } from '../common/noita-sprite-animation.ts';

export interface NoitaGif {
  animationId: string;
  sprite: SpriteAnimation;
  buffer: Uint8Array;
  repeat: boolean;
  firstFrame: string;
}
