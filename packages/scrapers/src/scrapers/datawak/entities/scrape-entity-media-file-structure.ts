import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { EntityMediaFileMap } from '@noita-explorer/model-noita';
import { stringHelpers } from '@noita-explorer/tools';
import { scrapeEntityMediaFile } from './scrape-entity-media-file.ts';

interface Props {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}

export async function scrapeEntityMediaFileStructures({
  dataWakParentDirectoryApi,
}: Props): Promise<EntityMediaFileMap> {
  let dirQueue = [dataWakParentDirectoryApi];
  const entityMediaFileMap: EntityMediaFileMap = {};

  while (true) {
    const currentDir = dirQueue.shift();
    if (!currentDir) break;

    // add sub dirs to the queue
    const subDirs = await currentDir.listDirectories();
    dirQueue = dirQueue.concat(subDirs);

    const files = await currentDir.listFiles();
    // process all png files, or xml files that represent a sprite animation
    const processableXmlFiles = files.filter((f) =>
      f.getName().endsWith('.xml'),
    );

    for (const file of processableXmlFiles) {
      const path = stringHelpers.trim({
        text: file.getFullPath(),
        fromStart: dataWakParentDirectoryApi.getFullPath() + '/',
      });
      const entityMediaFile = await scrapeEntityMediaFile({
        dataWakParentDirectoryApi,
        file: file,
      });

      if (!entityMediaFile) continue;

      entityMediaFileMap[path] = entityMediaFile;
    }
  }

  return entityMediaFileMap;
}
