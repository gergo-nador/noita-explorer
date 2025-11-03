import {
  FileSystemDirectoryAccess,
  ImagePngDimension,
} from '@noita-explorer/model';
import { createBufferReader, stringHelpers } from '@noita-explorer/tools';

interface Props {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}

export async function scrapeDataWakImageDimensions({
  dataWakParentDirectoryApi,
}: Props) {
  let dirQueue = [dataWakParentDirectoryApi];
  const imgDimensionsTemp: Record<string, ImagePngDimension> = {};

  while (true) {
    const currentDir = dirQueue.shift();
    if (!currentDir) break;

    // add sub dirs to the queue
    const subDirs = await currentDir.listDirectories();
    dirQueue = dirQueue.concat(subDirs);

    // check file sizes
    const files = await currentDir.listFiles();
    const pngFiles = files.filter((f) => f.getName().endsWith('.png'));

    for (const pngFile of pngFiles) {
      const buffer = await pngFile.read.asBuffer();
      const bufferReader = createBufferReader(buffer);

      const path = stringHelpers.trim({
        text: pngFile.getFullPath(),
        fromStart: dataWakParentDirectoryApi.getFullPath() + '/',
      });
      try {
        const pngHeader = bufferReader.readPngHeader();
        imgDimensionsTemp[path] = pngHeader;
      } catch {
        // do nothing
      }
    }
  }

  return imgDimensionsTemp;
}
