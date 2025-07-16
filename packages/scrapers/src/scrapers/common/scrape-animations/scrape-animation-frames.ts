import { Sprite } from '@noita-explorer/model-noita';
import { imageHelpers } from '@noita-explorer/tools';
import { calculateFramePositions } from './calculate-frame-positions.ts';
import { AnimationFramesResult } from './types.ts';

export const scrapeAnimationFrames = async ({
  sprite,
  imageBase64,
}: {
  sprite: Sprite;
  imageBase64: string;
}) => {
  const animations: AnimationFramesResult[] = [];
  for (const spriteAnimation of sprite.animations) {
    const framePositions = calculateFramePositions(spriteAnimation);

    const frameImages: string[] = [];
    for (const framePosition of framePositions) {
      const image = await imageHelpers.cropImageBase64(imageBase64, {
        x: framePosition.x,
        y: framePosition.y,
        width: spriteAnimation.frameActualWidth,
        height: spriteAnimation.frameActualHeight,
      });

      frameImages.push(image);
    }

    animations.push({ animation: spriteAnimation, frameImages });
  }

  return animations;
};
