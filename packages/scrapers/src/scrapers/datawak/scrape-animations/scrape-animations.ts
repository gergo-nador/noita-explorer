import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { parseAnimationXml } from './parse-animation-xml.ts';
import { noitaPaths } from '../../../noita-paths.ts';
import { imageHelpers, gifHelpers } from '@noita-explorer/tools';
import { Sprite, SpriteAnimation, NoitaGif } from '@noita-explorer/model-noita';

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

      const gif: NoitaGif = {
        animationId: framesResult.animation.name,
        sprite: framesResult.animation,
        buffer: gifResult.buffer,
        repeat: framesResult.animation.loop,
        firstFrame: framesResult.frameImages[0],
      };

      animations.gifs.push(gif);
    }

    animationsReturnValue[animationInfo.id] = animations;
  }

  return animationsReturnValue;
};

const scrapeAnimationXmlDefinition = async ({
  id,
  animationsFiles,
}: {
  id: string;
  animationsFiles: FileSystemFileAccess[];
}) => {
  const xmlFilePath = id + '.xml';
  const xmlFile = animationsFiles.find(
    (file) => file.getName() === xmlFilePath,
  );

  if (!xmlFile) {
    return undefined;
  }

  const xmlText = await xmlFile.read.asText();
  const parsedXml = await parseXml(xmlText);
  const xml = XmlWrapper(parsedXml);

  return parseAnimationXml({ xml, id });
};

interface AnimationFramesResult {
  animation: SpriteAnimation;
  frameImages: string[];
}

const scrapeAnimationFrames = async ({
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

const calculateFramePositions = (
  animation: SpriteAnimation,
): { x: number; y: number }[] => {
  const positions: Array<{ x: number; y: number }> = [];

  for (let frameIndex = 0; frameIndex < animation.frameCount; frameIndex++) {
    const col = frameIndex % animation.framesPerRow;
    const row = Math.floor(frameIndex / animation.framesPerRow);

    const x = animation.posX + col * animation.frameWidth;
    const y = animation.posY + row * animation.frameHeight;

    positions.push({ x, y });
  }

  return positions;
};
