import { ChunkRawFormat } from '../interfaces/chunk-raw-format.ts';
import { Buffer } from 'buffer';
import { readBufferArray } from '../utils/read-buffer-array.ts';
import { readBufferString } from '../utils/read-buffer-string.ts';
import { ChunkPhysicsObject } from '../interfaces/chunk-physics-object.ts';

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

  // contains pointers to either materials or custom colors
  const cellDataBuffer = chunkBuffer.subarray(
    bufferOffset,
    bufferOffset + cellDataLength,
  );
  const cellDataOutput = readBufferArray(cellDataBuffer, {
    length: cellDataLength,
  }).iterate((buffer) => ({
    item: buffer.readUint8(0),
    offset: 1,
  }));
  bufferOffset += cellDataOutput.offset;

  // materials that are in the current chunk (max 128 materials)
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

  // custom colors in the chunk
  const customColorsBuffer = chunkBuffer.subarray(bufferOffset);
  const customColorsOutput = readBufferArray(customColorsBuffer).iterate(
    (buffer) => ({ item: buffer.readUInt32BE(0), offset: 4 }),
  );
  bufferOffset += customColorsOutput.offset;

  // physics objects in the chunk
  const physicsObjectsBuffer = chunkBuffer.subarray(bufferOffset);
  const physicsObjectsOutput = readBufferArray(physicsObjectsBuffer).iterate(
    (buffer) => {
      // ulong id
      // uint material
      const posX = buffer.readFloatBE(12);
      const posY = buffer.readFloatBE(16);
      const rotation = buffer.readFloatBE(20);
      // 5 unknown long: 40 bytes
      // 5 unknown bools: 5 bytes
      // 1 unknown float: 4 bytes
      const width = buffer.readUInt32BE(73);
      const height = buffer.readUInt32BE(77);

      const pixelDataBuffer = chunkBuffer.subarray(81);
      const pixelData = readBufferArray(pixelDataBuffer, {
        length: width * height,
      }).iterate((buffer) => ({
        item: buffer.readUInt32BE(0),
        offset: 4,
      }));

      const physicsObject = {
        posX: posX,
        posY: posY,
        rotation: rotation,
        // 5 unknown long: 40 bytes
        // 5 unknown bools: 5 bytes
        // 1 unknown float: 4 bytes
        width: width,
        height: height,

        pixelData: pixelData.items,
      } satisfies ChunkPhysicsObject;

      return {
        item: physicsObject,
        offset: 81 + pixelData.offset,
      };
    },
  );

  const chunk: ChunkRawFormat = {
    version: version,
    width: width,
    height: height,

    cellData: cellDataOutput.items,
    materialIds: materialsOutput.items,
    customColors: customColorsOutput.items,

    physicsObjects: physicsObjectsOutput.items,
  };
  return chunk;
}
