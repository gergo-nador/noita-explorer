import { Sprite } from '@noita-explorer/model-noita';
import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { imageHelpers } from '@noita-explorer/tools';
import { calculateFramePositions } from './calculate-frame-positions.ts';
import { AnimationFramesResult } from './types.ts';

export const scrapeAnimationFrames = async ({
  sprite,
  dataWakParentDirectoryApi,
}: {
  sprite: Sprite;
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}) => {
  const png = await dataWakParentDirectoryApi.getFile(sprite.spriteFilename);
  const imageBase64 = await png.read.asImageBase64();

  const animations: AnimationFramesResult[] = [];
  for (const spriteAnimation of sprite.animations) {
    const framePositions = calculateFramePositions(spriteAnimation);
    const frameImages: string[] = [];
    for (const framePosition of framePositions) {
      const image = await imageHelpers.cropImageBase64(imageBase64, {
        x: framePosition.x,
        y: framePosition.y,
        width: spriteAnimation.frameWidth,
        height: spriteAnimation.frameHeight,
      });

      frameImages.push(image);
    }

    animations.push({ animation: spriteAnimation, frameImages });
  }

  return animations;
};
