import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { stringHelpers } from '@noita-explorer/tools';
import { DataWakMediaIndex } from '@noita-explorer/model-noita';
import { scrapeMediaPath } from './scrape-media-path.ts';

interface Props {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}

export async function scrapeDataWakMediaIndex({
  dataWakParentDirectoryApi,
}: Props) {
  let dirQueue = [dataWakParentDirectoryApi];
  const imgDimensionsTemp: Record<string, DataWakMediaIndex> = {};

  while (true) {
    const currentDir = dirQueue.shift();
    if (!currentDir) break;

    // add sub dirs to the queue
    const subDirs = await currentDir.listDirectories();
    dirQueue = dirQueue.concat(subDirs);

    const files = await currentDir.listFiles();
    // process all png files, or xml files that represent a sprite animation
    const processableMediaFiles = files.filter(
      (f) => f.getName().endsWith('.png') || f.getName().endsWith('.xml'),
    );

    for (const file of processableMediaFiles) {
      const path = stringHelpers.trim({
        text: file.getFullPath(),
        fromStart: dataWakParentDirectoryApi.getFullPath() + '/',
      });
      const mediaIndex = await scrapeMediaPath({
        dataWakParentDirectoryApi,
        file: file,
      });

      if (!mediaIndex) continue;

      imgDimensionsTemp[path] = mediaIndex;
    }
  }

  return imgDimensionsTemp;
}
