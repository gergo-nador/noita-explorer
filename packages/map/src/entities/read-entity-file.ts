import { Buffer } from 'buffer';
import { readBufferString } from '../utils/read-buffer-string.ts';
import { readBufferArray } from '../utils/read-buffer-array.ts';
import { createBufferReader } from '../buffer-reader/buffer-reader.ts';
import { readEntityArray } from './read-entity-array.ts';
import { EntitySchema } from '../schema/entity-schema.ts';

interface Props {
  entityBuffer: Buffer;
  parseSchema: (hash: string) => Promise<EntitySchema>;
}

export async function readEntityFile({ entityBuffer, parseSchema }: Props) {
  const bufferReader = createBufferReader(entityBuffer);

  const version = bufferReader.readInt32BE();
  /*
    if version is 0x020020 then it should be empty???
   */
  if (version !== 2) {
    throw new Error(`Invalid entity version. Expected 2; received ${version}`);
  }

  const schemaFileName = readBufferString(bufferReader);
  const schema = await parseSchema(schemaFileName);

  const entitiesOut = readBufferArray(bufferReader).iterate((bufferReader) =>
    readEntityArray({ bufferReader, entitySchema: schema }),
  );

  return { schemaFile: schemaFileName, entities: entitiesOut.items };
}
