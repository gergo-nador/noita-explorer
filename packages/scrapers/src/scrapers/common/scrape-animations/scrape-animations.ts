import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import {
  base64Helpers,
  gifHelpers,
  stringHelpers,
} from '@noita-explorer/tools';
import {
  NoitaScrapedGif,
  NoitaScrapedMediaGif,
} from '@noita-explorer/model-noita';
import { scrapeAnimationFrames } from './scrape-animation-frames.ts';
import { scrapeAnimationXmlDefinition } from './scrape-animation-xml-definition.ts';
import { AnimationInfo } from './types.ts';
import { readImageFromAnimationInfo } from './read-image-from-animation-info.ts';

export const scrapeAnimations = async ({
  dataWakParentDirectoryApi,
  animationInfos,
}: {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
  animationInfos: AnimationInfo[];
}): Promise<StringKeyDictionary<NoitaScrapedMediaGif>> => {
  const animationsReturnValue: StringKeyDictionary<NoitaScrapedMediaGif> = {};

  for (const animationInfo of animationInfos) {
    try {
      const animations = await scrapeAnimation({
        animationInfo: animationInfo,
        dataWakParentDirectoryApi,
      });

      if (!animations) {
        continue;
      }

      animationsReturnValue[animationInfo.id] = animations;
    } catch (ex) {
      console.error('Error for id ' + animationInfo.id, ex);
    }
  }

  return animationsReturnValue;
};

const scrapeAnimation = async ({
  animationInfo,
  dataWakParentDirectoryApi,
}: {
  animationInfo: AnimationInfo;
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}) => {
  const sprite = await scrapeAnimationXmlDefinition({
    id: animationInfo.id,
    file: animationInfo.file,
  });

  const animations: NoitaScrapedMediaGif = {
    type: 'gif',
    gifs: [],
  };

  const imageBase64 = await readImageFromAnimationInfo({
    animationInfo: animationInfo,
    sprite: sprite,
    dataWakParentDirectoryApi: dataWakParentDirectoryApi,
  });

  const framesResults = await scrapeAnimationFrames({
    sprite: sprite,
    imageBase64: imageBase64,
  });

  for (const framesResult of framesResults) {
    const delayMs = framesResult.animation.frameWait * 1000;
    const gifResult = await gifHelpers.createGif({
      frames: framesResult.frameImages,
      delayMs: delayMs,
      repeat: framesResult.animation.loop ? 0 : undefined,
      width: framesResult.animation.frameActualWidth,
      height: framesResult.animation.frameActualHeight,
    });

    const gifBuffer = stringHelpers.uint8ArrayToBase64(gifResult.buffer);
    const gifBufferBase64 = base64Helpers.appendMetadata(gifBuffer);

    const gif: NoitaScrapedGif = {
      animationId: framesResult.animation.name,
      sprite: framesResult.animation,
      buffer: gifBufferBase64,
      repeat: framesResult.animation.loop,
      firstFrame: framesResult.frameImages[0],
    };

    animations.gifs.push(gif);
  }
  return animations;
};
