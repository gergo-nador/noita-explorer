import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
  Vector2d,
} from '@noita-explorer/model';
import { FastLZCompressor } from '@noita-explorer/fastlz';
import {
  ChunkRenderableEntity,
  readEntityFile,
  readEntitySchema,
  uncompressNoitaFile,
  ChunkEntityComponent,
  ChunkEntity,
  ChunkRenderableEntitySprite,
} from '@noita-explorer/map';
import { noitaSchemaManager } from './noita-schema-manager.ts';
import { arrayHelpers } from '@noita-explorer/tools';
import { noitaDataWakManager } from './noita-data-wak-manager.ts';
import { base64ToImageData } from './base64-to-image-data.ts';
import { mapConstants } from '@noita-explorer/map';

export async function processEntityFile({
  entityFile,
  compressor,
  chunkCoords,
}: {
  entityFile: FileSystemFileAccess;
  compressor: FastLZCompressor;
  chunkCoords: Vector2d;
}): Promise<ChunkRenderableEntity[]> {
  const uncompressed = await uncompressNoitaFile(entityFile, compressor);

  // get schema
  const schemaHash = await readEntitySchema({ entityBuffer: uncompressed });
  const schema = await noitaSchemaManager.getSchema(schemaHash.schemaFile);

  const entityFileProcessed = await readEntityFile({
    entityBuffer: uncompressed,
    schema: schema,
  });

  const chunkMinX = chunkCoords.x * mapConstants.chunkWidth;
  const chunkMaxX = (chunkCoords.x + 1) * mapConstants.chunkWidth;
  const chunkMinY = chunkCoords.y * mapConstants.chunkHeight;
  const chunkMaxY = (chunkCoords.y + 1) * mapConstants.chunkHeight;

  const renderableEntities: ChunkRenderableEntity[] = [];
  for (const entity of entityFileProcessed.entities) {
    // filter out entities that are not in the current chunk
    if (entity.position.x < chunkMinX || entity.position.x > chunkMaxX)
      continue;
    if (entity.position.y < chunkMinY || entity.position.y > chunkMaxY)
      continue;

    const renderableEntity = await processEntity({ entity });
    if (!renderableEntity) continue;

    renderableEntities.push(renderableEntity);
  }

  return renderableEntities;
}

async function processEntity({
  entity,
}: {
  entity: ChunkEntity;
}): Promise<ChunkRenderableEntity | undefined> {
  const dataWak = await noitaDataWakManager.getDataWak();
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
    await processPixelSprites({
      entity,
      pixelSprites,
      renderableEntity,
      dataWak,
    });
  }

  // console.log({ entity, components: entity.components });
  // debugger;

  return renderableEntity;
}

async function processPixelSprites({
  entity,
  renderableEntity,
  pixelSprites,
  dataWak,
}: {
  entity: ChunkEntity;
  renderableEntity: ChunkRenderableEntity;
  pixelSprites: ChunkEntityComponent[];
  dataWak: FileSystemDirectoryAccess;
}) {
  for (const pixelSprite of pixelSprites) {
    const imageFile = pixelSprite.data?.image_file;
    if (typeof imageFile === 'string' && imageFile.length > 0) {
      const spriteFile = await dataWak.getFile(imageFile);
      const image = await spriteFile.read.asImageBase64();
      const imageData = await base64ToImageData(image);

      const sprite: ChunkRenderableEntitySprite = {
        position: entity.position,
        rotation: entity.rotation,
        scale: entity.scale,
        imageData: imageData,
        isBackgroundComponent: Boolean(
          pixelSprite.data?.clean_overlapping_pixels,
        ),
      };

      renderableEntity.sprites.push(sprite);
    }
  }
}
