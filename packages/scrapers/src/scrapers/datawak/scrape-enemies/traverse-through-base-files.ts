import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { extractEnemyProperties } from './extract-enemy-properties.ts';
import { NoitaScrapedEnemy } from '@noita-explorer/model-noita';

/**
 * Traverses through the hierarchy tree of base definitions
 * @param enemy the enemy object to fill up
 * @param file the current base file
 * @param dataWakParentDirectoryApi
 */
export const traverseThroughBaseFiles = async ({
  enemy,
  file,
  dataWakParentDirectoryApi,
}: {
  enemy: NoitaScrapedEnemy;
  file: FileSystemFileAccess;
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}) => {
  const xmlText = await file.read.asText().then(parseXml);
  const xml = XmlWrapper(xmlText);

  const entityTag = xml.findNthTag('Entity');
  if (entityTag === undefined) {
    return;
  }

  const filePath = file
    .getFullPath()
    .substring(dataWakParentDirectoryApi.getFullPath().length);
  enemy.debug.fileHierarchy.push(filePath);

  const baseTag = entityTag.findNthTag('Base');
  const baseFilePath = baseTag?.getAttribute('file')?.asText();
  if (baseTag !== undefined && baseFilePath !== undefined) {
    const baseFileExists =
      await dataWakParentDirectoryApi.checkRelativePathExists(baseFilePath);

    if (baseFileExists) {
      const baseFile = await dataWakParentDirectoryApi.getFile(baseFilePath);
      await traverseThroughBaseFiles({
        enemy: enemy,
        file: baseFile,
        dataWakParentDirectoryApi: dataWakParentDirectoryApi,
      });
    }
  }

  extractEnemyProperties({ enemy, entityTag });
};
