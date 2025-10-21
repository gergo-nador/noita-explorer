import { ChunkRawFormat } from '../interfaces/chunk-raw-format.ts';
import { Buffer } from 'buffer';
import { readBufferArray } from '../utils/read-buffer-array.ts';
import { readBufferString } from '../utils/read-buffer-string.ts';
import { ChunkPhysicsObject } from '../interfaces/chunk-physics-object.ts';
import { BufferReaderIteratorCallback } from '../interfaces/buffer-reader-iterator-callback.ts';
import { BufferReader, createBufferReader } from '../utils/buffer-reader.ts';

export function readRawChunk(chunkBuffer: Buffer): ChunkRawFormat {
  const bufferReader = createBufferReader(chunkBuffer);

  const version = bufferReader.readInt32BE();
  const width = bufferReader.readInt32BE();
  const height = bufferReader.readInt32BE();

  if (version !== 24) {
    throw new Error(
      `Invalid Chunk version number. Expected: 24; actual: ${version}.`,
    );
  }

  const cellDataLength = width * height;

  // contains pointers to either materials or custom colors
  const cellDataOutput = readBufferArray(bufferReader, {
    length: cellDataLength,
  }).iterate((bufferReader) => bufferReader.readUint8());

  // materials that are in the current chunk (max 128 materials)
  const materialsOutput = readBufferArray(bufferReader).iterate(
    (bufferReader) => readBufferString(bufferReader, { encoding: 'ascii' }),
  );

  // custom colors in the chunk
  const customColorsOutput = readBufferArray(bufferReader).iterate(
    (bufferReader) => bufferReader.readUInt32BE(),
  );

  // physics objects in the chunk
  const physicsObjectsOutput =
    readBufferArray(bufferReader).iterate(readPhysicsObject);

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

const readPhysicsObject: BufferReaderIteratorCallback<ChunkPhysicsObject> = (
  bufferReader: BufferReader,
) => {
  bufferReader.jumpBytes(12);
  // ulong id
  // uint material
  const posX = bufferReader.readFloatBE();
  const posY = bufferReader.readFloatBE();
  const rotation = bufferReader.readFloatBE();
  bufferReader.jumpBytes(49);
  // 5 unknown long: 40 bytes
  // 5 unknown bools: 5 bytes
  // 1 unknown float: 4 bytes
  const width = bufferReader.readUInt32BE();
  const height = bufferReader.readUInt32BE();

  const pixelData = readBufferArray(bufferReader, {
    length: width * height,
  }).iterate((bufferReader) => bufferReader.readUInt32BE());

  const physicsObject = {
    position: { x: posX, y: posY },
    rotation: rotation,
    width: width,
    height: height,

    pixelData: pixelData.items,
  } satisfies ChunkPhysicsObject;

  return physicsObject;
};
