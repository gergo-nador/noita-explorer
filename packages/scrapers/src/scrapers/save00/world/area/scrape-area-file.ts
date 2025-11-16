import { Buffer } from 'buffer';
import { createBufferReader } from '@noita-explorer/tools';
import { readBufferArray } from '../../../../utils/buffer-reader-utils/read-buffer-array.ts';
import { readBufferString } from '../../../../utils/buffer-reader-utils/read-buffer-string.ts';
import { FastLZCompressor } from '@noita-explorer/fastlz';
import { uncompressNoitaBuffer } from '../../../../utils/noita-file-uncompress/uncompress-noita-buffer.ts';
import { AreaBinFileFormat, AreaBinEntity } from '@noita-explorer/model-noita';

interface Props {
  areaBuffer: Buffer;
  fastLzCompressor: FastLZCompressor;
}

export async function scrapeAreaFile({
  areaBuffer,
  fastLzCompressor,
}: Props): Promise<AreaBinFileFormat> {
  const uncompressedEntityBuffer = await uncompressNoitaBuffer(
    areaBuffer,
    fastLzCompressor,
  );
  const bufferReader = createBufferReader(uncompressedEntityBuffer);

  // first three numbers of the buffer:
  // 1. 0 or -1
  // 2. the number in the area file name
  // 3. one
  bufferReader.jumpBytes(12);

  const positionsArray = readBufferArray(bufferReader).iterate(
    (bufferReader) => {
      const index = bufferReader.readInt32BE();
      const x = bufferReader.readFloatBE();
      const y = bufferReader.readFloatBE();

      return { index, x, y };
    },
  );

  const entityArray = readBufferArray(bufferReader).iterate((bufferReader) => {
    const filePath = readBufferString(bufferReader);

    // there are two additional unknown numbers here, if you know what
    // they represent, please create an issue and explain it to me <3

    return { filePath };
  });

  const entities: AreaBinEntity[] = [];

  for (const position of positionsArray.items) {
    const entity = entityArray.items[position.index];
    if (!entity) throw new Error('entity id out of bounds');

    const binEntity: AreaBinEntity = {
      filePath: entity.filePath,
      position: { x: position.x, y: position.y },
    };
    entities.push(binEntity);
  }

  return { entities: entities };
}
