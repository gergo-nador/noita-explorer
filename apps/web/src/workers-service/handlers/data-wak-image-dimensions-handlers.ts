import { http, HttpResponse } from 'msw';
import { ImagePngDimension } from '@noita-explorer/model';
import { noitaDataWakManager } from '../noita-data-wak-manager.ts';
import { createBufferReader, stringHelpers } from '@noita-explorer/tools';

let imageDimensions: Record<string, ImagePngDimension> | undefined = undefined;

export const dataWakImageDimensionsHandlers = [
  http.get('/data-wak-image-dimensions', async () => {
    if (typeof imageDimensions === 'object') {
      return HttpResponse.json(imageDimensions, { status: 200 });
    }

    const dataWak = noitaDataWakManager.get();
    if (!dataWak) {
      console.error('Data.wak is not initialized in the service worker');
      return new HttpResponse(null, { status: 404 });
    }

    let dirQueue = [dataWak];
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
          fromStart: dataWak.getFullPath() + '/',
        });
        try {
          const pngHeader = bufferReader.readPngHeader();
          imgDimensionsTemp[path] = pngHeader;
        } catch {
          // do nothing
        }
      }
    }

    imageDimensions = imgDimensionsTemp;
    return HttpResponse.json(imageDimensions, { status: 200 });
  }),
];
