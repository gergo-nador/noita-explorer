import { scrape } from '@noita-explorer/scrapers';
import { NoitaEntitySchema } from '@noita-explorer/model-noita';
import { FastLZCompressor } from '@noita-explorer/fastlz';
import { ChunkRenderableEntity } from '../../interfaces/chunk-renderable-entity.ts';
import { parseEntity } from './parse-entity.ts';
import { Buffer } from 'buffer';

interface Props {
  entityBuffer: Buffer;
  fastLzCompressor: FastLZCompressor;
  schema: NoitaEntitySchema;
}

export async function parseEntityFile({
  entityBuffer,
  fastLzCompressor,
  schema,
}: Props): Promise<{ entities: ChunkRenderableEntity[] }> {
  const entityFileContent = await scrape.save00.entityFile({
    entityBuffer: entityBuffer,
    schema: schema,
    fastLzCompressor,
  });

  const renderableEntities: ChunkRenderableEntity[] = [];
  for (const entity of entityFileContent.entities) {
    const renderableEntity = await parseEntity({ entity });
    if (!renderableEntity) continue;

    renderableEntities.push(renderableEntity);
  }

  return { entities: renderableEntities };
}
