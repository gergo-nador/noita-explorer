import { scrape } from '@noita-explorer/scrapers';
import {
  DataWakMediaIndex,
  NoitaEntitySchema,
} from '@noita-explorer/model-noita';
import { FastLZCompressor } from '@noita-explorer/fastlz';
import { ChunkRenderableEntity } from '../../interfaces/chunk-renderable-entity.ts';
import { parseEntity } from './parse-entity.ts';
import { Buffer } from 'buffer';
import { StringKeyDictionary } from '@noita-explorer/model';

interface Props {
  entityBuffer: Buffer;
  fastLzCompressor: FastLZCompressor;
  schema: NoitaEntitySchema;
  mediaIndex: StringKeyDictionary<DataWakMediaIndex>;
}

export async function parseEntityFile({
  entityBuffer,
  fastLzCompressor,
  schema,
  mediaIndex,
}: Props): Promise<{ entities: ChunkRenderableEntity[] }> {
  const entityFileContent = await scrape.save00.entityFile({
    entityBuffer: entityBuffer,
    schema: schema,
    fastLzCompressor,
  });

  const renderableEntities: ChunkRenderableEntity[] = [];
  for (const entity of entityFileContent.entities) {
    const renderableEntity = await parseEntity({ entity, mediaIndex });
    if (!renderableEntity) continue;

    renderableEntities.push(renderableEntity);
  }

  return { entities: renderableEntities };
}
