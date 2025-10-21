import { Buffer } from 'buffer';
import { readBufferString } from '../utils/read-buffer-string.ts';
import { readBufferArray } from '../utils/read-buffer-array.ts';
import { BufferReaderIteratorCallback } from '../interfaces/buffer-reader-iterator-callback.ts';
import { ChunkEntity } from '../interfaces/chunk-entity.ts';
import { createBufferReader } from '../utils/buffer-reader.ts';

export function readEntityFile(entityBuffer: Buffer) {
  const bufferReader = createBufferReader(entityBuffer);

  const version = bufferReader.readInt32BE();
  if (version !== 2) {
    throw new Error(`Invalid entity version. Expected 2; received ${version}`);
  }

  const schemaFileName = readBufferString(bufferReader);

  const entitiesOut = readBufferArray(bufferReader).iterate(readEntityArray);

  return { schemaFile: schemaFileName, entities: entitiesOut.items };
}

const readEntityArray: BufferReaderIteratorCallback<ChunkEntity> = (
  bufferReader,
) => {
  const offset = bufferReader.readInt32BE();
  return { offset } as unknown as ChunkEntity;
};
