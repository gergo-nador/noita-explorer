import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import { noitaPaths } from '../../../noita-paths.ts';
import {
  base64Helpers,
  gifHelpers,
  stringHelpers,
} from '@noita-explorer/tools';
import { Sprite, NoitaGif } from '@noita-explorer/model-noita';
import { scrapeAnimationFrames } from './scrape-animation-frames.ts';
import { scrapeAnimationXmlDefinition } from './scrape-animation-xml-definition.ts';

export const scrapeAnimations = async ({
  dataWakParentDirectoryApi,
  animationInfos,
}: {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
  animationInfos: { id: string }[];
}) => {
  const animationsFolderPath = await dataWakParentDirectoryApi.path.join(
    noitaPaths.noitaDataWak.entities,
  );
  const animationsFolder =
    await dataWakParentDirectoryApi.getDirectory(animationsFolderPath);
  const animationFiles = await animationsFolder.listFiles();

  const animationsReturnValue: StringKeyDictionary<{
    sprite: Sprite;
    gifs: NoitaGif[];
  }> = {};

  for (const animationInfo of animationInfos) {
    const sprite = await scrapeAnimationXmlDefinition({
      id: animationInfo.id,
      animationsFiles: animationFiles,
    });

    if (!sprite) {
      // record this as xml file not found
      continue;
    }

    const animations: { sprite: Sprite; gifs: NoitaGif[] } = {
      sprite,
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
      });

      const gifBuffer = stringHelpers.uint8ArrayToBase64(gifResult.buffer);
      const gifBufferBase64 = base64Helpers.appendMetadata(gifBuffer);

      const gif: NoitaGif = {
        animationId: framesResult.animation.name,
        sprite: framesResult.animation,
        buffer: gifBufferBase64,
        repeat: framesResult.animation.loop,
        firstFrame: framesResult.frameImages[0],
      };

      animations.gifs.push(gif);
    }

    animationsReturnValue[animationInfo.id] = animations;
  }

  return animationsReturnValue;
};
