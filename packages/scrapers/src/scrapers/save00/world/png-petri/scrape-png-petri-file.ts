import { FileSystemFileAccess } from '@noita-explorer/model';
import { uncompressNoitaFile } from '../../../../utils/noita-file-uncompress/uncompress-noita-file.ts';
import { BufferReader, createBufferReader } from '@noita-explorer/tools';
import { readBufferArray } from '../../../../utils/buffer-reader-utils/read-buffer-array.ts';
import { readBufferString } from '../../../../utils/buffer-reader-utils/read-buffer-string.ts';
import { ChunkFileFormat } from '@noita-explorer/model-noita';
import { scrapePhysicsObject } from './scrape-physics-object.ts';
import { FastLZCompressor } from '@noita-explorer/fastlz';
import { uncompressNoitaBuffer } from '../../../../utils/noita-file-uncompress/uncompress-noita-buffer.ts';
import { Buffer } from 'buffer';

export const scrapePngPetriFile = async ({
  pngPetriFile,
  fastLzCompressor,
}: {
  pngPetriFile: FileSystemFileAccess | Buffer;
  fastLzCompressor: FastLZCompressor;
}) => {
  let bufferReader: BufferReader;

  const isFile = 'read' in pngPetriFile;
  if (!isFile) {
    const uncompressedPetriBuffer = await uncompressNoitaBuffer(
      pngPetriFile,
      fastLzCompressor,
    );
    bufferReader = createBufferReader(uncompressedPetriBuffer);
  } else {
    const uncompressedPngPetriBuffer = await uncompressNoitaFile(
      pngPetriFile,
      fastLzCompressor,
    );
    bufferReader = createBufferReader(uncompressedPngPetriBuffer);
  }

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
  const physicsObjectsOutput = readBufferArray(bufferReader).iterate(
    (bufferReader) => scrapePhysicsObject({ bufferReader }),
  );

  const chunk: ChunkFileFormat = {
    width: width,
    height: height,

    cellData: cellDataOutput.items,
    materialIds: materialsOutput.items,
    customColors: customColorsOutput.items,

    physicsObjects: physicsObjectsOutput.items,
  };
  return chunk;
};
