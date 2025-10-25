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
import { arrayHelpers, imageHelpers } from '@noita-explorer/tools';
import { noitaDataWakManager } from './noita-data-wak-manager.ts';
import { mapConstants } from '@noita-explorer/map';
import { scrape } from '@noita-explorer/scrapers';

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
  if ('SpriteComponent' in components) {
    const sprites = components['SpriteComponent'];
    await processSprites({ sprites, entity, renderableEntity, dataWak });
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
      const imageData = await readImageFile({ imageFile, dataWak });
      if (!imageData) continue;

      const sprite: ChunkRenderableEntitySprite = {
        position: entity.position,
        rotation: entity.rotation,
        scale: entity.scale,
        imageData: imageData as ImageData,
        isAdditive: Boolean(pixelSprite.data?.additive),
        isBackgroundComponent: Boolean(
          pixelSprite.data?.clean_overlapping_pixels,
        ),
      };

      renderableEntity.sprites.push(sprite);
    }
  }
}

async function processSprites({
  entity,
  renderableEntity,
  sprites,
  dataWak,
}: {
  entity: ChunkEntity;
  renderableEntity: ChunkRenderableEntity;
  sprites: ChunkEntityComponent[];
  dataWak: FileSystemDirectoryAccess;
}) {
  for (const sprite of sprites) {
    const imageFile = sprite.data?.image_file;
    if (typeof imageFile === 'string' && imageFile.length > 0) {
      const imageData = await readImageFile({ imageFile, dataWak });
      if (!imageData) continue;

      const renderableSprite: ChunkRenderableEntitySprite = {
        position: entity.position,
        rotation: entity.rotation,
        scale: entity.scale,
        imageData: imageData as ImageData,
        isAdditive: Boolean(sprite.data?.additive),
        isBackgroundComponent: false,
      };

      const offset_x = sprite.data.offset_x;
      const offset_y = sprite.data.offset_y;
      if (typeof offset_x === 'number') renderableSprite.position.x -= offset_x;
      if (typeof offset_y === 'number') renderableSprite.position.y -= offset_y;

      //renderableSprite.position.x -= Math.trunc(imageData.width / 2);
      //renderableSprite.position.y -= Math.trunc(imageData.height / 2);

      renderableEntity.sprites.push(renderableSprite);
    }
  }
  // @ts-expect-error faefaerff aef aer
  const imageFile: string = sprites[0]?.data?.image_file ?? '';
  if (
    !imageFile.includes('vines') &&
    !imageFile.includes('lantern_small_flame.xml') &&
    !imageFile.includes('data/particles/smoke_orange.xml')
  ) {
    //debugger;
  }
}

async function readImageFile({
  imageFile,
  dataWak,
}: {
  imageFile: string;
  dataWak: FileSystemDirectoryAccess;
}) {
  let spriteFile: FileSystemFileAccess;
  try {
    spriteFile = await dataWak.getFile(imageFile);
  } catch {
    return;
  }

  if (imageFile.endsWith('.png')) {
    const image = await spriteFile.read.asImageBase64();
    return await imageHelpers.base64ToImageData(image);
  }

  const animationInfo = { id: imageFile, file: spriteFile };
  const animation = await scrape.scrapeAnimationFrames({
    animationInfo,
    dataWakParentDirectoryApi: dataWak,
  });

  const firstFrame = animation[0]?.frameImages[0];
  if (!firstFrame) return;

  return await imageHelpers.base64ToImageData(firstFrame);
}
