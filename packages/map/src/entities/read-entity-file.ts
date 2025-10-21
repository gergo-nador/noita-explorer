import { Buffer } from 'buffer';
import { readBufferString } from '../utils/read-buffer-string.ts';
import { readBufferArray } from '../utils/read-buffer-array.ts';
import { BufferReaderIteratorCallback } from '../interfaces/buffer-reader-iterator-callback.ts';
import { ChunkEntity } from '../interfaces/chunk-entity.ts';

export function readEntityFile(entityBuffer: Buffer) {
  const version = entityBuffer.readInt32BE(0);

  if (version !== 2) {
    throw new Error(`Invalid entity version. Expected 2; received ${version}`);
  }

  let offset = 4;

  const schemaFileName = readBufferString(entityBuffer.subarray(offset));
  offset += schemaFileName.offset;

  const entityArrayBuffer = entityBuffer.subarray(offset);
  const entitiesOut =
    readBufferArray(entityArrayBuffer).iterate(readEntityArray);

  return { schemaFile: schemaFileName.text, entities: entitiesOut.items };
}

const readEntityArray: BufferReaderIteratorCallback<ChunkEntity> = (buffer) => {
  buffer.readInt32BE();
  return { item: {} as ChunkEntity, offset: 3 };
};
