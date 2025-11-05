import { scrapeEntityComponentVariable } from './scrape-entity-component-variable.ts';
import { StringKeyDictionary } from '@noita-explorer/model';
import { BufferReader } from '@noita-explorer/tools';
import {
  ChunkEntityComponent,
  NoitaEntitySchema,
} from '@noita-explorer/model-noita';
import { readBufferString } from '../../../../utils/buffer-reader-utils/read-buffer-string.ts';

interface Props {
  bufferReader: BufferReader;
  entitySchema: NoitaEntitySchema;
}

export function scrapeEntityComponent({ bufferReader, entitySchema }: Props) {
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
    data[variable.name] = scrapeEntityComponentVariable({
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
