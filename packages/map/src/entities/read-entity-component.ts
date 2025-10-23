import { ChunkEntityComponent } from './chunk-entity-component.ts';
import { readBufferString } from '../utils/read-buffer-string.ts';
import { BufferReader } from '../buffer-reader/buffer-reader.types.ts';
import { EntitySchema } from '../schema/entity-schema.ts';
import { readEntityComponentVariable } from './read-entity-component-variable.ts';
import { StringKeyDictionary } from '@noita-explorer/model';

interface Props {
  bufferReader: BufferReader;
  entitySchema: EntitySchema;
}

export function readEntityComponent({ bufferReader, entitySchema }: Props) {
  const name = readBufferString(bufferReader);
  const deleted = bufferReader.readBool();
  const enabled = bufferReader.readBool();
  const tags = readBufferString(bufferReader);

  // read fields
  const component = entitySchema.components[name];

  if (!component) {
    throw new Error(`Cannot read entity component with name "${name}"`);
  }

  const variables = component.variables;
  const data: StringKeyDictionary<unknown> = {};
  for (const variable of variables) {
    data[variable.name] = readEntityComponentVariable({
      bufferReader,
      variable,
    });
  }

  const entityComponent: ChunkEntityComponent = {
    name,
    deleted,
    enabled,
    tags,
    data,
  };

  return entityComponent;
}
