import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { parseAnimationXml } from './parse-animation-xml.ts';
import { noitaPaths } from '../../../noita-paths.ts';
import { imageHelpers } from '@noita-explorer/tools';
import { SpriteAnimation } from './types.ts';

type CropImageFunctionType = (
  imageBase64: string,
  options: { x: number; y: number; width: number; height: number },
) => Promise<string>;

export const scrapeAnimations = async ({
  dataWakParentDirectoryApi,
  cropImageOverride,
}: {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
  cropImageOverride?: CropImageFunctionType;
}) => {
  const animationsFolderPath = await dataWakParentDirectoryApi.path.join(
    noitaPaths.noitaDataWak.entities,
  );
  const animationsFolder =
    await dataWakParentDirectoryApi.getDirectory(animationsFolderPath);

  return scrapeAnimation({
    id: 'alchemist',
    animationsFolder,
    dataWakParentDirectoryApi,
    cropImageOverride,
  });
};

const scrapeAnimation = async ({
  id,
  animationsFolder,
  dataWakParentDirectoryApi,
  cropImageOverride,
}: {
  id: string;
  animationsFolder: FileSystemDirectoryAccess;
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
  cropImageOverride?: CropImageFunctionType;
}) => {
  const xmlFilePath = id + '.xml';
  const xmlFile = await animationsFolder.getFile(xmlFilePath);
  const xmlText = await xmlFile.read.asText();
  const parsedXml = await parseXml(xmlText);
  const xml = XmlWrapper(parsedXml);

  const sprite = parseAnimationXml({ xml, id });

  const png = await dataWakParentDirectoryApi.getFile(sprite.spriteFilename);
  const imageBase64 = await png.read.asImageBase64();

  const animations = [];
  for (const spriteAnimation of sprite.animations) {
    const framePositions = calculateFramePositions(spriteAnimation);
    const frameImages: string[] = [];
    for (const framePosition of framePositions) {
      const cropImage = cropImageOverride ?? imageHelpers.cropImageBase64;
      const image = await cropImage(imageBase64, {
        x: framePosition.x,
        y: framePosition.y,
        width: spriteAnimation.frameWidth,
        height: spriteAnimation.frameHeight,
      });

      frameImages.push(image);
    }

    animations.push({ animation: spriteAnimation, frameImages });
  }

  return { sprite, png, animations };
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
