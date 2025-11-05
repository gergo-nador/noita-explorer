import { scrapeEntityArray } from './scrape-entity-array.ts';
import { createBufferReader } from '@noita-explorer/tools';
import { readBufferString } from '../../../../utils/buffer-reader-utils/read-buffer-string.ts';
import { ChunkEntity, NoitaEntitySchema } from '@noita-explorer/model-noita';
import { readBufferArray } from '../../../../utils/buffer-reader-utils/read-buffer-array.ts';
import { FileSystemFileAccess } from '@noita-explorer/model';
import { uncompressNoitaFile } from '../../../../utils/noita-file-uncompress/uncompress-noita-file.ts';
import { FastLZCompressor } from '@noita-explorer/fastlz';

interface Props {
  entityFile: FileSystemFileAccess;
  schema: NoitaEntitySchema;
  fastLzCompressor: FastLZCompressor;
}

export async function scrapeEntityFile({
  entityFile,
  schema,
  fastLzCompressor,
}: Props) {
  const uncompressedEntityBuffer = await uncompressNoitaFile(
    entityFile,
    fastLzCompressor,
  );
  const bufferReader = createBufferReader(uncompressedEntityBuffer);

  const version = bufferReader.readInt32BE();
  /*
    if version is 0x020020 then it should be empty???
   */
  if (version !== 2) {
    throw new Error(`Invalid entity version. Expected 2; received ${version}`);
  }

  // schema hash, not used
  readBufferString(bufferReader);

  const entitiesOut = readBufferArray(bufferReader).iterate((bufferReader) =>
    scrapeEntityArray({ bufferReader, entitySchema: schema }),
  );

  const entities = [...entitiesOut.items];
  const entitiesWithChildrenSorted = lookForChildren({
    array: entities,
    from: 0,
    length: entities.length,
  }).children;

  return { entities: entitiesWithChildrenSorted };
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
