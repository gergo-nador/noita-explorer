import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import { WorldPixelSceneFileFormat } from '@noita-explorer/model-noita';
import { noitaPaths } from '../../../../noita-paths.ts';
import { uncompressNoitaFile } from '../../../../utils/noita-file-uncompress/uncompress-noita-file.ts';
import { createBufferReader } from '@noita-explorer/tools';
import { readBufferArray } from '../../../../utils/buffer-reader-utils/read-buffer-array.ts';
import { scrapePixelScene } from './scrape-pixel-scene.ts';
import { scrapePixelSceneBackgroundImage } from './scrape-pixel-scene-background-image.ts';
import { FastLZCompressor } from '@noita-explorer/fastlz';

export const scrapeWorldPixelScenes = async ({
  save00DirectoryApi,
  fastLzCompressor,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
  fastLzCompressor: FastLZCompressor;
}): Promise<WorldPixelSceneFileFormat | undefined> => {
  const worldPixelScenesPath = await save00DirectoryApi.path.join(
    noitaPaths.save00.world.world_pixel_scenes,
  );

  let worldPixelScenesFile: FileSystemFileAccess;
  try {
    worldPixelScenesFile =
      await save00DirectoryApi.getFile(worldPixelScenesPath);
  } catch {
    return undefined;
  }

  const uncompressedPixelScenesBuffer = await uncompressNoitaFile(
    worldPixelScenesFile,
    fastLzCompressor,
  );
  const bufferReader = createBufferReader(uncompressedPixelScenesBuffer);

  const version = bufferReader.readInt32BE();
  const WORLD_PIXEL_SCENE_VERSION = 3;
  if (version !== WORLD_PIXEL_SCENE_VERSION) {
    throw new Error(
      `Invalid world_pixel_scenes buffer version. Expected ${WORLD_PIXEL_SCENE_VERSION}, received ${version}`,
    );
  }

  const magicNum = bufferReader.readInt32BE();
  const WORLD_PIXEL_SCENE_MAGIC_NUMBER = 0x2f0aa9f;
  if (magicNum !== WORLD_PIXEL_SCENE_MAGIC_NUMBER) {
    throw new Error(
      `Invalid world_pixel_scenes magic number. Expected ${WORLD_PIXEL_SCENE_MAGIC_NUMBER.toString(16)}, received ${magicNum.toString(16)}`,
    );
  }

  const pendingPixelScenes = readBufferArray(bufferReader).iterate(
    (bufferReader) => scrapePixelScene({ bufferReader }),
  );
  const placedPixelScenes = readBufferArray(bufferReader).iterate(
    (bufferReader) => scrapePixelScene({ bufferReader }),
  );

  const backgroundImages = readBufferArray(bufferReader).iterate(
    (bufferReader) => scrapePixelSceneBackgroundImage({ bufferReader }),
  );

  return {
    pendingPixelScenes: pendingPixelScenes.items,
    placedPixelScenes: placedPixelScenes.items,
    backgroundImages: backgroundImages.items,
  };
};
