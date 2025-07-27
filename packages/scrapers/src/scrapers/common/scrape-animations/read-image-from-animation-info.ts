import { AnimationInfo } from './types.ts';
import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import { imageHelpers } from '@noita-explorer/tools';
import { Sprite } from '@noita-explorer/model-noita';
import { scrapeAnimationXmlDefinition } from './scrape-animation-xml-definition.ts';

interface Props {
  animationInfo: AnimationInfo;
  sprite?: Sprite;
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}
export const readImageFromAnimationInfo = async ({
  animationInfo,
  sprite,
  dataWakParentDirectoryApi,
}: Props): Promise<string> => {
  const fileName = animationInfo.file.getName();
  const isXmlFile = fileName.endsWith('.xml');
  const isPngFile = fileName.endsWith('.png');

  let pngFile: FileSystemFileAccess;
  if (isPngFile) {
    pngFile = animationInfo.file;
  } else if (sprite || isXmlFile) {
    sprite ??= await scrapeAnimationXmlDefinition({
      id: animationInfo.id,
      file: animationInfo.file,
    });

    pngFile = await dataWakParentDirectoryApi.getFile(sprite.spriteFilename);
  } else {
    throw new Error('No png file for id: ' + animationInfo.id);
  }

  if (pngFile === undefined) {
    throw new Error(
      'Could not find animation image for id: ' + animationInfo.id,
    );
  }

  let imageBase64 = await pngFile.read.asImageBase64();

  if (animationInfo.imageManipulation?.reColor !== undefined) {
    imageBase64 = await imageHelpers.pixelRecolor(
      imageBase64,
      animationInfo.imageManipulation.reColor,
    );
  }

  return imageBase64;
};
