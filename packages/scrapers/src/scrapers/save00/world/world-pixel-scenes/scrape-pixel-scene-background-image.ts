import { BufferReader } from '@noita-explorer/tools';
import { WorldPixelSceneBackgroundImage } from '@noita-explorer/model-noita';
import { readBufferString } from '../../../../utils/buffer-reader-utils/read-buffer-string.ts';

export const scrapePixelSceneBackgroundImage = ({
  bufferReader,
}: {
  bufferReader: BufferReader;
}): WorldPixelSceneBackgroundImage => {
  const posX = bufferReader.readInt32BE();
  const posY = bufferReader.readInt32BE();

  const fileName = readBufferString(bufferReader);

  return {
    position: { x: posX, y: posY },
    fileName,
  };
};
