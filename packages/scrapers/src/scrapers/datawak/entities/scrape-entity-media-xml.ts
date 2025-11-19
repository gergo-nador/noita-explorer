import { XmlWrapperType } from '@noita-explorer/tools/xml';
import { EntityMediaStructure } from '@noita-explorer/model-noita';
import {
  getEntitySpriteComponents,
  getPhysicsImageShapeComponents,
} from '../enemies/get-entity-sprites.ts';
import { scrapeMediaPath } from '../media/scrape-media-path.ts';
import { FileSystemDirectoryAccess } from '@noita-explorer/model';

interface Props {
  xml: XmlWrapperType;
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}

export async function scrapeEntityMediaXml({
  xml,
  dataWakParentDirectoryApi,
}: Props): Promise<EntityMediaStructure> {
  const sprites = getEntitySpriteComponents({ entityTag: xml }) ?? [];
  const physicsSprites =
    getPhysicsImageShapeComponents({ entityTag: xml }) ?? [];

  const entityMediaStructure: EntityMediaStructure = {
    media: [],
    entities: [],
  };

  const allSprites = [...sprites, ...physicsSprites];
  for (const sprite of allSprites) {
    const mediaFile = await dataWakParentDirectoryApi.getFile(sprite.imageFile);
    const mediaIndex = await scrapeMediaPath({
      dataWakParentDirectoryApi,
      file: mediaFile,
    });

    if (!mediaIndex) continue;
    entityMediaStructure.media.push(mediaIndex);
  }

  const entities = xml.getChild('Entity') ?? [];
  for (const entity of entities) {
    const childEntityMediaStructure = await scrapeEntityMediaXml({
      xml: entity,
      dataWakParentDirectoryApi,
    });
    entityMediaStructure.entities.push(childEntityMediaStructure);
  }

  return entityMediaStructure;
}
