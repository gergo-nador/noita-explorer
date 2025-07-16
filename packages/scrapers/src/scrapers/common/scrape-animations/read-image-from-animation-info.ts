import { AnimationInfo } from './types.ts';
import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import { imageHelpers } from '@noita-explorer/tools';
import { Sprite } from '@noita-explorer/model-noita';

interface Props {
  animationInfo: AnimationInfo;
  animationFiles: FileSystemFileAccess[];
  sprite?: Sprite;
  dataWakParentDirectoryApi?: FileSystemDirectoryAccess;
}
export const readImageFromAnimationInfo = async ({
  animationInfo,
  animationFiles,
  sprite,
  dataWakParentDirectoryApi,
}: Props): Promise<string> => {
  let pngFile;

  if (dataWakParentDirectoryApi && sprite) {
    pngFile = await dataWakParentDirectoryApi.getFile(sprite.spriteFilename);
  } else {
    const pngFileName = animationInfo.id + '.png';
    pngFile = animationFiles.find((f) => f.getName() === pngFileName);
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
        animationFiles: animationFiles,
      });

      imageBase64 = await imageHelpers.overlayImages(imageBase64, image);
    }
  }

  return imageBase64;
};
