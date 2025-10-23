import { Buffer } from 'buffer';
import { readBufferString } from '../utils/read-buffer-string.ts';
import { readBufferArray } from '../utils/read-buffer-array.ts';
import { readEntityArray } from './read-entity-array.ts';
import { EntitySchema } from '../schema/entity-schema.ts';
import { createBufferReader } from '@noita-explorer/tools';
import { ChunkEntity } from './chunk-entity.ts';

interface Props {
  entityBuffer: Buffer;
  schema: EntitySchema;
}

export async function readEntityFile({ entityBuffer, schema }: Props) {
  const bufferReader = createBufferReader(entityBuffer);

  const version = bufferReader.readInt32BE();
  /*
    if version is 0x020020 then it should be empty???
   */
  if (version !== 2) {
    throw new Error(`Invalid entity version. Expected 2; received ${version}`);
  }

  const schemaFileName = readBufferString(bufferReader);

  const entitiesOut = readBufferArray(bufferReader).iterate((bufferReader) =>
    readEntityArray({ bufferReader, entitySchema: schema }),
  );

  const entities = [...entitiesOut.items];
  const entitiesWithChildrenSorted = lookForChildren({
    array: entities,
    from: 0,
    length: entities.length,
  }).children;

  return { schemaFile: schemaFileName, entities: entitiesWithChildrenSorted };
}

function lookForChildren({
  from,
  length,
  array,
}: {
  from: number;
  length: number;
  array: ChunkEntity[];
}) {
  const children: ChunkEntity[] = [];

  for (let i = from; i < from + length && i < array.length; i++) {
    const child = array[i];
    children.push(child);

    const childrenCount = child.childrenCount;
    if (childrenCount === 0) {
      continue;
    }

    const subChildren = lookForChildren({
      array,
      from: i + 1,
      length: childrenCount,
    });

    child.children = subChildren.children;
    i = subChildren.continueAt;
  }

  return { children, continueAt: from + length };
}
