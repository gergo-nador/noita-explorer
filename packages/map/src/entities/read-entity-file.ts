import { Buffer } from 'buffer';
import { readBufferString } from '../utils/read-buffer-string.ts';
import { readBufferArray } from '../utils/read-buffer-array.ts';
import { readEntityArray } from './read-entity-array.ts';
import { EntitySchema } from '../schema/entity-schema.ts';
import { createBufferReader } from '@noita-explorer/tools';

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

  return { schemaFile: schemaFileName, entities: entitiesOut.items };
}
