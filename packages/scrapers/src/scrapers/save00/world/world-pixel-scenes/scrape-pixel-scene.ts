import { BufferReader } from '@noita-explorer/tools';
import {
  WorldPixelScene,
  WorldPixelSceneColorMaterial,
} from '@noita-explorer/model-noita';
import { readBufferString } from '../../../../utils/buffer-reader-utils/read-buffer-string.ts';
import { readBufferArray } from '../../../../utils/buffer-reader-utils/read-buffer-array.ts';

export const scrapePixelScene = ({
  bufferReader,
}: {
  bufferReader: BufferReader;
}): WorldPixelScene => {
  const posX = bufferReader.readInt32BE();
  const posY = bufferReader.readInt32BE();

  const materialFileName = readBufferString(bufferReader);
  const colorFileName = readBufferString(bufferReader);
  const backgroundFileName = readBufferString(bufferReader);

  const skipBiomeChecks = bufferReader.readBool();
  const skipEdgeTextures = bufferReader.readBool();

  const backgroundZIndex = bufferReader.readInt32BE();
  const loadEntity = readBufferString(bufferReader);
  const cleanAreaBefore = bufferReader.readBool();

  // there is an extra `DebugReloadMe` flag which we don't care about
  bufferReader.jumpBytes(1);

  const colorMaterials = readBufferArray(bufferReader).iterate(
    (bufferReader): WorldPixelSceneColorMaterial => {
      const color = bufferReader.readInt32BE();
      const cellType = bufferReader.readInt32BE();

      return { color, cellType };
    },
  );

  return {
    position: { x: posX, y: posY },
    materialFileName,
    colorFileName,
    backgroundFileName,
    skipBiomeChecks,
    skipEdgeTextures,

    backgroundZIndex,
    loadEntity,
    cleanAreaBefore,
    colorMaterial: colorMaterials.items,
  } satisfies WorldPixelScene;
};
