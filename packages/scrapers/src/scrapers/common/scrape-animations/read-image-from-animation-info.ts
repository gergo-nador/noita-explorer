import { AnimationInfo } from './types.ts';
import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import { imageHelpers } from '@noita-explorer/tools';
import { Sprite } from '@noita-explorer/model-noita';

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
  const isPngFile = fileName.endsWith('.png');

  let pngFile: FileSystemFileAccess;
  if (isPngFile) {
    pngFile = animationInfo.file;
  } else if (sprite) {
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

  if (animationInfo.layers) {
    for (const layer of animationInfo.layers) {
      const image = await readImageFromAnimationInfo({
        animationInfo: layer,
        dataWakParentDirectoryApi: dataWakParentDirectoryApi,
      });

      imageBase64 = await imageHelpers.overlayImages(imageBase64, image);
    }
  }

  return imageBase64;
};
