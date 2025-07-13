import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import {
  base64Helpers,
  gifHelpers,
  stringHelpers,
} from '@noita-explorer/tools';
import {
  NoitaScrapedGif,
  NoitaScrapedGifWrapper,
} from '@noita-explorer/model-noita';
import { scrapeAnimationFrames } from './scrape-animation-frames.ts';
import { scrapeAnimationXmlDefinition } from './scrape-animation-xml-definition.ts';
import { AnimationInfo } from './types.ts';

export const scrapeAnimations = async ({
  dataWakParentDirectoryApi,
  animationInfos,
  animationsPath,
}: {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
  animationInfos: AnimationInfo[];
  animationsPath: string[];
}): Promise<StringKeyDictionary<NoitaScrapedGifWrapper>> => {
  const animationsFolderPath =
    await dataWakParentDirectoryApi.path.join(animationsPath);
  const animationsFolder =
    await dataWakParentDirectoryApi.getDirectory(animationsFolderPath);
  const animationFiles = await animationsFolder.listFiles();

  const animationsReturnValue: StringKeyDictionary<NoitaScrapedGifWrapper> = {};

  for (const animationInfo of animationInfos) {
    try {
      const animations = await scrapeAnimation({
        animationFiles,
        id: animationInfo.id,
        dataWakParentDirectoryApi,
      });

      if (!animations) {
        console.error('Could not find animation for id ' + animationInfo.id);
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
  id,
  dataWakParentDirectoryApi,
  animationFiles,
}: {
  id: string;
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
  animationFiles: FileSystemFileAccess[];
}) => {
  const sprite = await scrapeAnimationXmlDefinition({
    id: id,
    animationsFiles: animationFiles,
  });

  if (!sprite) {
    return;
  }

  const animations: NoitaScrapedGifWrapper = {
    gifs: [],
  };

  const framesResults = await scrapeAnimationFrames({
    sprite: sprite,
    dataWakParentDirectoryApi,
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
