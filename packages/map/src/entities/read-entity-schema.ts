import { Buffer } from 'buffer';
import { createBufferReader } from '@noita-explorer/tools';
import { readBufferString } from '../utils/read-buffer-string.ts';

interface Props {
  entityBuffer: Buffer;
}

export async function readEntitySchema({ entityBuffer }: Props) {
  const bufferReader = createBufferReader(entityBuffer);

  const version = bufferReader.readInt32BE();
  /*
    if version is 0x020020 then it should be empty???
   */
  if (version !== 2) {
    throw new Error(`Invalid entity version. Expected 2; received ${version}`);
  }

  const schemaFileName = readBufferString(bufferReader);

  return { schemaFile: schemaFileName };
}
