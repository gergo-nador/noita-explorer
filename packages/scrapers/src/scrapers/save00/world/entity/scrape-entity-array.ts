import { scrapeEntityComponent } from './scrape-entity-component.ts';
import { BufferReader } from '@noita-explorer/tools';
import { NoitaEntitySchema, ChunkEntity } from '@noita-explorer/model-noita';
import { readBufferString } from '../../../../utils/buffer-reader-utils/read-buffer-string.ts';
import { readBufferArray } from '../../../../utils/buffer-reader-utils/read-buffer-array.ts';

interface Props {
  bufferReader: BufferReader;
  entitySchema: NoitaEntitySchema;
}

export const scrapeEntityArray = ({ bufferReader, entitySchema }: Props) => {
  const name = readBufferString(bufferReader);
  const lifetimePhase = bufferReader.readUint8();
  const fileName = readBufferString(bufferReader);
  const tags = readBufferString(bufferReader);

  const posX = bufferReader.readFloatBE();
  const posY = bufferReader.readFloatBE();
  const scaleX = bufferReader.readFloatBE();
  const scaleY = bufferReader.readFloatBE();
  const rotation = bufferReader.readFloatBE();

  const components = readBufferArray(bufferReader).iterate((bufferReader) =>
    scrapeEntityComponent({ bufferReader, entitySchema }),
  );
  const childrenCount = bufferReader.readInt32BE();

  const entity: ChunkEntity = {
    name,
    fileName,
    lifetimePhase,
    tags,
    rotation,
    position: { x: posX, y: posY },
    scale: { x: scaleX, y: scaleY },
    components: components.items,
    childrenCount,
    children: [],
  };

  return entity;
};
