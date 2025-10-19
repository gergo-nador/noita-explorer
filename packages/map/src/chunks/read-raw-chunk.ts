import { ChunkRawFormat } from './chunk-raw-format.ts';
import { Buffer } from 'buffer';
import { readBufferArray } from '../utils/read-buffer-array.ts';
import { readBufferString } from '../utils/read-buffer-string.ts';

export function readRawChunk(chunkBuffer: Buffer): ChunkRawFormat {
  let bufferOffset = 0;

  const version = chunkBuffer.readInt32BE(0);
  const width = chunkBuffer.readInt32BE(4);
  const height = chunkBuffer.readInt32BE(8);

  if (version !== 24) {
    throw new Error(
      `Invalid Chunk version number. Expected: 24; actual: ${version}.`,
    );
  }

  bufferOffset = 12;
  const cellDataLength = width * height;

  const cellDataBuffer = chunkBuffer.subarray(
    bufferOffset,
    bufferOffset + cellDataLength,
  );
  const cellDataOutput = readBufferArray(cellDataBuffer, {
    length: cellDataLength,
  }).iterate((buffer) => ({
    item: buffer.readInt8(0),
    offset: 1,
  }));
  bufferOffset += cellDataOutput.offset;

  const materialsDataBuffer = chunkBuffer.subarray(bufferOffset);
  const materialsOutput = readBufferArray(materialsDataBuffer).iterate(
    (buffer) => {
      const output = readBufferString(buffer, { encoding: 'ascii' });

      return {
        item: output.text,
        offset: output.offset,
      };
    },
  );
  bufferOffset += materialsOutput.offset;

  const customColorsBuffer = chunkBuffer.subarray(bufferOffset);
  const customColorsOutput = readBufferArray(customColorsBuffer).iterate(
    (buffer) => ({ item: buffer.readInt32BE(0), offset: 4 }),
  );

  const chunk: ChunkRawFormat = {
    version: version,
    width: width,
    height: height,

    cellData: cellDataOutput.items,
    materialIds: materialsOutput.items,
    customColors: customColorsOutput.items,
  };
  return chunk;
}
