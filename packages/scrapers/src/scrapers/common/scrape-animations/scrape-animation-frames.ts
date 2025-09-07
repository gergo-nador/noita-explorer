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
  const imageDimensions = await imageHelpers.getImageSizeBase64(imageBase64);

  for (const spriteAnimation of sprite.animations) {
    const framePositions = calculateFramePositions(spriteAnimation);

    const frameImages: string[] = [];
    for (const framePosition of framePositions) {
      const image = await imageHelpers.cropImageBase64(imageBase64, {
        x: framePosition.x,
        y: framePosition.y,
        width: Math.min(
          spriteAnimation.frameActualWidth,
          imageDimensions.width - framePosition.x,
        ),
        height: Math.min(
          spriteAnimation.frameActualHeight,
          imageDimensions.height - framePosition.y,
        ),
      });

      frameImages.push(image);
    }

    animations.push({ animation: spriteAnimation, frameImages });
  }

  return animations;
};
