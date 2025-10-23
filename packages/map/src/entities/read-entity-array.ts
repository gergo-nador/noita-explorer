import { ChunkEntity } from './chunk-entity.ts';
import { readBufferString } from '../utils/read-buffer-string.ts';
import { readBufferArray } from '../utils/read-buffer-array.ts';
import { readEntityComponent } from './read-entity-component.ts';
import { BufferReader } from '../buffer-reader/buffer-reader.types.ts';
import { EntitySchema } from '../schema/entity-schema.ts';

interface Props {
  bufferReader: BufferReader;
  entitySchema: EntitySchema;
}

export const readEntityArray = ({ bufferReader, entitySchema }: Props) => {
  const name = readBufferString(bufferReader);
  const lifetimePhase = bufferReader.readUint8();
  const fileName = readBufferString(bufferReader);
  const tags = readBufferString(bufferReader);

  const posX = bufferReader.readFloatBE();
  const posY = bufferReader.readFloatBE();
  const scaleX = bufferReader.readFloatBE();
  const scaleY = bufferReader.readFloatBE();
  const rotation = bufferReader.readFloatBE();

  readBufferArray(bufferReader).iterate((bufferReader) =>
    readEntityComponent({ bufferReader, entitySchema }),
  );
  bufferReader.jumpBytes(4);

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
