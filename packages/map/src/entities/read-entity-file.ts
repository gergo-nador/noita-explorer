import { Buffer } from 'buffer';
import { readBufferString } from '../utils/read-buffer-string.ts';
import { readBufferArray } from '../utils/read-buffer-array.ts';
import { BufferReaderIteratorCallback } from '../interfaces/buffer-reader-iterator-callback.ts';
import { ChunkEntity } from '../interfaces/chunk-entity.ts';
import { createBufferReader } from '../utils/buffer-reader.ts';
import { ChunkEntityComponent } from '../interfaces/chunk-entity-component.ts';

export function readEntityFile(entityBuffer: Buffer) {
  const bufferReader = createBufferReader(entityBuffer);

  const version = bufferReader.readInt32BE();
  /*
    if version is 0x020020 then it should be empty???
   */
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
  const name = readBufferString(bufferReader);
  const lifetimePhase = bufferReader.readUint8();
  const fileName = readBufferString(bufferReader);
  const tags = readBufferString(bufferReader);

  const posX = bufferReader.readFloatBE();
  const posY = bufferReader.readFloatBE();
  const scaleX = bufferReader.readFloatBE();
  const scaleY = bufferReader.readFloatBE();
  const rotation = bufferReader.readFloatBE();

  readBufferArray(bufferReader).iterate(readEntityComponent);

  const entity: ChunkEntity = {
    name,
    fileName,
    lifetimePhase,
    tags,
    rotation,
    position: { x: posX, y: posY },
    scale: { x: scaleX, y: scaleY },
  };

  return entity;
};

const readEntityComponent: BufferReaderIteratorCallback<
  ChunkEntityComponent
> = (bufferReader) => {
  const name = readBufferString(bufferReader);
  const deleted = bufferReader.readBool();
  const enabled = bufferReader.readBool();
  const tags = readBufferString(bufferReader);

  // read fields

  const entityComponent: ChunkEntityComponent = {
    name,
    deleted,
    enabled,
    tags,
  };

  return entityComponent;
};
