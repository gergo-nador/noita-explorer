import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import {
  base64Helpers,
  gifHelpers,
  imageHelpers,
  stringHelpers,
} from '@noita-explorer/tools';
import {
  NoitaScrapedGif,
  NoitaScrapedMediaGif,
  Sprite,
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
  const animations: NoitaScrapedMediaGif = {
    type: 'gif',
    gifs: [],
  };

  const { framesResults } = await assembleAnimationFrames({
    info: animationInfo,
    dataWakParentDirectoryApi: dataWakParentDirectoryApi,
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

const assembleAnimationFrames = async ({
  info,
  dataWakParentDirectoryApi,
  overrideSprite,
}: {
  info: AnimationInfo;
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
  overrideSprite?: Sprite;
}) => {
  const sprite =
    overrideSprite ??
    (await scrapeAnimationXmlDefinition({
      id: info.id,
      file: info.file,
    }));

  const imageBase64 = await readImageFromAnimationInfo({
    animationInfo: info,
    sprite: sprite,
    dataWakParentDirectoryApi: dataWakParentDirectoryApi,
  });

  const framesResults = await scrapeAnimationFrames({
    sprite: sprite,
    imageBase64: imageBase64,
  });

  if (!info.layers) {
    return { framesResults, sprite };
  }

  for (const layer of info.layers) {
    const { framesResults: layerFrameResults, sprite: layerSprite } =
      await assembleAnimationFrames({
        info: layer,
        dataWakParentDirectoryApi,
        overrideSprite: layer.useSameSprite ? sprite : undefined,
      });

    for (const animation of framesResults) {
      // get the matching layer animation
      let layerAnimation = layerFrameResults.find(
        (a) => a.animation.name === animation.animation.name,
      );

      // or the default animation if the matching animation does not exist
      layerAnimation ??= layerFrameResults.find(
        (a) => a.animation.name === layerSprite.defaultAnimation,
      );

      if (layerAnimation === undefined) continue;

      for (let i = 0; i < animation.frameImages.length; i++) {
        const mainFrame = animation.frameImages[i];
        const layerFrame =
          layerAnimation.frameImages[i % layerAnimation.frameImages.length];

        animation.frameImages[i] = await imageHelpers.overlayImages(
          mainFrame,
          layerFrame,
          layer.overlayOptions,
        );
      }
    }
  }

  return { framesResults, sprite };
};
