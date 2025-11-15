import {
  ChunkEntity,
  ChunkEntityComponent,
  DataWakMediaIndex,
} from '@noita-explorer/model-noita';
import { ChunkRenderableEntity } from '../../interfaces/chunk-renderable-entity.ts';
import { arrayHelpers } from '@noita-explorer/tools';
import { parseEntityPixelSprites } from './sprites/parse-entity-pixel-sprites.ts';
import { parseEntitySprites } from './sprites/parse-entity-sprites.ts';
import { StringKeyDictionary } from '@noita-explorer/model';

interface Props {
  entity: ChunkEntity;
  mediaIndex: StringKeyDictionary<DataWakMediaIndex>;
}

export async function parseEntity({
  entity,
  mediaIndex,
}: Props): Promise<ChunkRenderableEntity | undefined> {
  const renderableEntity: ChunkRenderableEntity = {
    name: entity.name,
    tags: entity.tags,
    lifetimePhase: entity.lifetimePhase,
    sprites: [],
  };

  const components = arrayHelpers
    .groupBy(
      entity.components,
      (component: ChunkEntityComponent) => component.name,
    )
    .asDict();

  if ('PixelSpriteComponent' in components) {
    const pixelSprites = components['PixelSpriteComponent'];
    await parseEntityPixelSprites({
      entity,
      pixelSprites,
      renderableEntity,
      mediaIndex,
    });
  }
  if ('SpriteComponent' in components) {
    const sprites = components['SpriteComponent'];
    await parseEntitySprites({
      sprites,
      entity,
      renderableEntity,
      mediaIndex,
    });
  }

  return renderableEntity;
}
