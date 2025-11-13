import { scrape } from '@noita-explorer/scrapers';
import { NoitaEntitySchema } from '@noita-explorer/model-noita';
import { FastLZCompressor } from '@noita-explorer/fastlz';
import { ChunkRenderableEntity } from '../../interfaces/chunk-renderable-entity.ts';
import { parseEntity } from './parse-entity.ts';
import { Buffer } from 'buffer';
import { ImagePngDimension, StringKeyDictionary } from '@noita-explorer/model';

interface Props {
  entityBuffer: Buffer;
  fastLzCompressor: FastLZCompressor;
  schema: NoitaEntitySchema;
  mediaDimensions: StringKeyDictionary<ImagePngDimension>;
}

export async function parseEntityFile({
  entityBuffer,
  fastLzCompressor,
  schema,
  mediaDimensions,
}: Props): Promise<{ entities: ChunkRenderableEntity[] }> {
  const entityFileContent = await scrape.save00.entityFile({
    entityBuffer: entityBuffer,
    schema: schema,
    fastLzCompressor,
  });

  const renderableEntities: ChunkRenderableEntity[] = [];
  for (const entity of entityFileContent.entities) {
    const renderableEntity = await parseEntity({ entity, mediaDimensions });
    if (!renderableEntity) continue;

    renderableEntities.push(renderableEntity);
  }

  return { entities: renderableEntities };
}
